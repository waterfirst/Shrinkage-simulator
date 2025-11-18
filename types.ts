
export enum ScanDirection {
  LONG_AXIS = 'long_axis', // 1850mm direction
  SHORT_AXIS = 'short_axis', // 1500mm direction
}

export interface SimulationParams {
  width: number;
  height: number;
  hasBML: boolean;
  scanDirection: ScanDirection;
  exaggeration: number;
  correctionFactor: number;
}

export interface Cell {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  shrunkenX: number;
  shrunkenY: number;
  shrunkenWidth: number;
  shrunkenHeight: number;
}

export interface SimulationResults {
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  shrinkageWidthPPM: number;
  shrinkageHeightPPM: number;
  cells: Cell[];
  isWidthLongAxis: boolean; // Relative to the cell geometry
}