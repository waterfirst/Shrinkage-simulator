
import { useMemo } from 'react';
import type { SimulationParams, SimulationResults, Cell } from '../types';
import { ScanDirection } from '../types';
import { 
  GRID_COLS, 
  GRID_ROWS, 
  CTE_PI, 
  CTE_GLASS, 
  TEMP_CHANGE_NO_BML, 
  TEMP_CHANGE_WITH_BML,
  RELAXATION_FACTOR,
  ANISOTROPY_FACTOR
} from '../constants';

export const useShrinkageCalculator = (params: SimulationParams): SimulationResults => {
  return useMemo(() => {
    const { width, height, hasBML, correctionFactor, scanDirection } = params;

    // 1. Calculate Thermal Strain
    // Formula: Strain = (CTE_PI - CTE_Glass) * DeltaT * RelaxationFactor
    // This represents the mismatch strain built into the PI during the high-temp process
    // which is released upon detachment.
    
    const cteMismatch = CTE_PI - CTE_GLASS; // (ppm/K)
    const deltaT = hasBML ? TEMP_CHANGE_WITH_BML : TEMP_CHANGE_NO_BML;
    
    const baseStrainPPM = cteMismatch * deltaT * RELAXATION_FACTOR;

    // 2. Apply Process Correction Factor (User Input)
    // Allows fine-tuning for unmodeled variables (Laser fluctuation, etc)
    const correctedStrainPPM = baseStrainPPM * correctionFactor;

    // 3. Apply Anisotropy based on Scan Direction
    // The scan direction creates a thermal history that induces higher shrinkage in that axis.
    // Per prompt/physics: Scan Axis has higher shrinkage than Perpendicular Axis.
    
    let anisotropyMultiplierW = 1.0;
    let anisotropyMultiplierH = 1.0;

    if (scanDirection === ScanDirection.LONG_AXIS) {
        // Scanning Vertical (Height)
        // Height gets the anisotropy boost
        anisotropyMultiplierH = ANISOTROPY_FACTOR;
        anisotropyMultiplierW = 1.0;
    } else {
        // Scanning Horizontal (Width)
        // Width gets the anisotropy boost
        anisotropyMultiplierW = ANISOTROPY_FACTOR;
        anisotropyMultiplierH = 1.0;
    }

    const shrinkageWidthPPM = Math.round(correctedStrainPPM * anisotropyMultiplierW);
    const shrinkageHeightPPM = Math.round(correctedStrainPPM * anisotropyMultiplierH);

    // 4. Grid Generation & Geometry
    // Glass: 1500 x 1850, 4x10 grid
    const marginX = width / GRID_COLS * 0.05;
    const marginY = height / GRID_ROWS * 0.05;
    
    const cellWidthOriginal = (width / GRID_COLS) - (2 * marginX);
    const cellHeightOriginal = (height / GRID_ROWS) - (2 * marginY);
    
    const isWidthLongAxis = cellWidthOriginal > cellHeightOriginal;

    // 5. Visualization Coordinates
    // We use a fixed exaggeration for the visual canvas so the user can always SEE the result,
    // while the text displays the accurate physics-calculated PPM.
    const VISUAL_EXAGGERATION = 150; 
    const ppmToVisualFactor = (ppm: number) => 1 - ((ppm * VISUAL_EXAGGERATION) / 1_000_000);

    const visualFactorX = ppmToVisualFactor(shrinkageWidthPPM);
    const visualFactorY = ppmToVisualFactor(shrinkageHeightPPM);
    
    // Real physical scaling factor (for accurate data, though usually negligible for layout)
    const realFactorX = 1 - (shrinkageWidthPPM / 1_000_000);
    const realFactorY = 1 - (shrinkageHeightPPM / 1_000_000);

    const cells: Cell[] = [];
    const slotW = width / GRID_COLS;
    const slotH = height / GRID_ROWS;
    const glassCenterX = width / 2;
    const glassCenterY = height / 2;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const cx = c * slotW + slotW / 2;
        const cy = r * slotH + slotH / 2;

        // Original Top-Left
        const x = cx - cellWidthOriginal / 2;
        const y = cy - cellHeightOriginal / 2;

        // Vector from center
        const distX = cx - glassCenterX;
        const distY = cy - glassCenterY;

        // New Center (Visually exaggerated)
        const newCx = glassCenterX + distX * visualFactorX;
        const newCy = glassCenterY + distY * visualFactorY;

        // New Dimensions (Visually exaggerated)
        const shrunkenWidth = cellWidthOriginal * visualFactorX;
        const shrunkenHeight = cellHeightOriginal * visualFactorY;

        cells.push({
          id: r * GRID_COLS + c,
          row: r,
          col: c,
          x,
          y,
          width: cellWidthOriginal,
          height: cellHeightOriginal,
          shrunkenX: newCx - shrunkenWidth / 2,
          shrunkenY: newCy - shrunkenHeight / 2,
          shrunkenWidth,
          shrunkenHeight
        });
      }
    }

    return {
      originalWidth: width,
      originalHeight: height,
      newWidth: width * realFactorX,
      newHeight: height * realFactorY,
      shrinkageWidthPPM,
      shrinkageHeightPPM,
      cells,
      isWidthLongAxis,
      scanDirection: scanDirection // Pass back the scan direction used for calculation
    };

  }, [params]);
};
