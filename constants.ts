
import { ScanDirection, type SimulationParams } from './types';

export const DEFAULT_EXAGGERATION = 100;
export const DEFAULT_CORRECTION_FACTOR = 1.0;

// Physics Constants (Approximated for Simulation Logic)
// These values are tuned to align with the expected shrinkage rates (~100-500 PPM)
export const CTE_PI = 60; // ppm/K
export const CTE_GLASS = 3; // ppm/K
export const TEMP_CHANGE_NO_BML = 7.0; // Effective thermal load factor
export const TEMP_CHANGE_WITH_BML = 3.5; // Reduced thermal load with BML
export const RELAXATION_FACTOR = 0.5;
export const ANISOTROPY_FACTOR = 2.5;

// Default parameters based on Samsung Display A3 6G Line
export const DEFAULT_PARAMS: SimulationParams = {
  width: 1500, // mm
  height: 1850, // mm
  hasBML: true,
  scanDirection: ScanDirection.LONG_AXIS,
  exaggeration: DEFAULT_EXAGGERATION,
  correctionFactor: DEFAULT_CORRECTION_FACTOR,
};

// Grid Configuration
export const GRID_COLS = 4;
export const GRID_ROWS = 10;

// Shrinkage parameters based on prompt:
// Cell Long Axis (Horizontal for 4x10): 0.05% = 500 PPM
// Cell Short Axis (Vertical for 4x10): 0.01-0.02% = ~150 PPM

// We assume these are the "Significant" shrinkage values, perhaps without optimization or the "Base" case.
// BML is known to reduce thermal stress and shrinkage. 
// We will map "No BML" to the higher shrinkage values provided in the prompt/PDF high-end.
// We will map "Has BML" to a reduced value (approx 30-40% reduction based on PDF charts).

export const SHRINKAGE_RATES = {
  NO_BML: {
    CELL_LONG_AXIS_PPM: 500, // 0.05%
    CELL_SHORT_AXIS_PPM: 200, // 0.02% (Upper bound of 0.01-0.02%)
  },
  WITH_BML: {
    CELL_LONG_AXIS_PPM: 350, // Reduced by BML
    CELL_SHORT_AXIS_PPM: 100, // 0.01% (Lower bound)
  },
};