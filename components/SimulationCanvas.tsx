
import React from 'react';
import type { SimulationResults, Cell } from '../types';
import { ScanDirection } from '../types';

interface SimulationCanvasProps {
  results: SimulationResults;
}

const ResultItem: React.FC<{ label: string; value: string; subtext?: string; className?: string }> = ({ label, value, subtext, className = '' }) => (
  <div className={`p-3 rounded-lg bg-base-200 border border-base-300 ${className}`}>
    <p className="text-xs uppercase font-bold text-content-200 tracking-wider">{label}</p>
    <p className="text-lg font-bold text-brand-dark mt-1">{value}</p>
    {subtext && <p className="text-xs text-content-200 mt-1">{subtext}</p>}
  </div>
);

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ results }) => {
  const {
    originalWidth,
    originalHeight,
    shrinkageWidthPPM,
    shrinkageHeightPPM,
    cells,
    isWidthLongAxis,
    scanDirection
  } = results;

  const maxDim = Math.max(originalWidth, originalHeight);
  const PADDING = maxDim * 0.15;
  const SVG_WIDTH = originalWidth + PADDING * 2;
  const SVG_HEIGHT = originalHeight + PADDING * 2;
  
  const FONT_SIZE = maxDim / 60;
  const STROKE_WIDTH = maxDim / 1200;

  const styles = {
    glass: { stroke: '#90CAF9', strokeWidth: STROKE_WIDTH, fill: '#F0F9FF' },
    cellOriginal: { stroke: '#BDBDBD', strokeWidth: STROKE_WIDTH, fill: 'none', strokeDasharray: '4 2' },
    cellShrunken: { stroke: '#1565C0', strokeWidth: STROKE_WIDTH, fill: 'rgba(33, 150, 243, 0.4)' },
    arrow: { fill: '#D32F2F', stroke: 'none' },
    text: { fill: '#1f2937', fontSize: FONT_SIZE, fontFamily: 'sans-serif', textAnchor: 'middle' as const },
    axisLabel: { fill: '#D32F2F', fontSize: FONT_SIZE * 1.2, fontWeight: 'bold', fontFamily: 'sans-serif' },
  };

  // Arrow for Scan Direction
  const arrowLength = maxDim * 0.2;
  
  // Determine shrinkage descriptions based on cell geometry
  const cellLongAxisShrink = isWidthLongAxis ? shrinkageWidthPPM : shrinkageHeightPPM;
  const cellShortAxisShrink = isWidthLongAxis ? shrinkageHeightPPM : shrinkageWidthPPM;

  return (
    <div className="bg-base-100 p-4 md:p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-brand-primary mb-2">6G Substrate Shrinkage Visualization</h2>
      <p className="text-sm text-content-200 mb-4">
        Visualizing a 4x10 grid of 14" OLED panels on a 1500x1850mm Mother Glass.
      </p>
      
      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <ResultItem 
          label="Cell Long Axis" 
          value={`${cellLongAxisShrink} PPM`} 
          subtext={isWidthLongAxis ? "Horizontal Shrinkage" : "Vertical Shrinkage"}
          className="bg-red-50 border-red-100"
        />
        <ResultItem 
          label="Cell Short Axis" 
          value={`${cellShortAxisShrink} PPM`} 
          subtext={!isWidthLongAxis ? "Horizontal Shrinkage" : "Vertical Shrinkage"}
          className="bg-blue-50 border-blue-100"
        />
         <ResultItem 
          label="Total Glass Size" 
          value={`${originalWidth} x ${originalHeight}`} 
          subtext="Millimeters"
        />
        <ResultItem 
          label="Grid Layout" 
          value="4 x 10" 
          subtext="14 inch Cells"
        />
      </div>

      {/* Visualization Area */}
      <div className="flex-grow w-full bg-base-200 rounded-md p-4 border border-base-300 flex items-center justify-center relative overflow-hidden">
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="max-h-[60vh] w-auto shadow-sm bg-white">
          <defs>
            <marker id="scanArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D32F2F" />
            </marker>
          </defs>

          {/* Mother Glass Outline */}
          <rect x={PADDING} y={PADDING} width={originalWidth} height={originalHeight} style={styles.glass} />
          
          {/* Cells Grid */}
          {cells.map((cell) => (
            <g key={cell.id}>
              {/* Original Cell (Outline) */}
              <rect 
                x={PADDING + cell.x} 
                y={PADDING + cell.y} 
                width={cell.width} 
                height={cell.height} 
                style={styles.cellOriginal} 
              />
              {/* Shrunken Cell (Filled) */}
              <rect 
                x={PADDING + cell.shrunkenX} 
                y={PADDING + cell.shrunkenY} 
                width={cell.shrunkenWidth} 
                height={cell.shrunkenHeight} 
                style={styles.cellShrunken} 
              />
            </g>
          ))}

          {/* ELA Scan Direction Indicator */}
          {scanDirection === ScanDirection.LONG_AXIS ? (
            <g transform={`translate(${PADDING/3}, ${SVG_HEIGHT - PADDING})`}>
               <line x1="0" y1="0" x2="0" y2={-arrowLength} stroke="#D32F2F" strokeWidth={STROKE_WIDTH * 5} markerEnd="url(#scanArrow)" />
               <text x="0" y={20} textAnchor="middle" fill="#D32F2F" fontSize={FONT_SIZE} fontWeight="bold">ELA SCAN</text>
            </g>
          ) : (
             <g transform={`translate(${PADDING}, ${PADDING/3})`}>
               <line x1="0" y1="0" x2={arrowLength} y2="0" stroke="#D32F2F" strokeWidth={STROKE_WIDTH * 5} markerEnd="url(#scanArrow)" />
               <text x={arrowLength/2} y={-10} textAnchor="middle" fill="#D32F2F" fontSize={FONT_SIZE} fontWeight="bold">ELA SCAN</text>
            </g>
          )}

          {/* Dimensions */}
          <text x={PADDING + originalWidth / 2} y={PADDING - 20} style={styles.text}>
            Width: {originalWidth}mm
          </text>
           <text x={PADDING - 20} y={PADDING + originalHeight / 2} style={styles.text} transform={`rotate(-90 ${PADDING - 20} ${PADDING + originalHeight / 2})`}>
            Height: {originalHeight}mm
          </text>

        </svg>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded border border-gray-200 text-xs shadow-sm flex flex-col gap-1">
            <div className="flex items-center">
                <div className="w-3 h-3 border border-gray-400 border-dashed mr-2"></div>
                <span>Original Position</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500/40 border border-blue-700 mr-2"></div>
                <span>Shrunken Position</span>
            </div>
            <div className="flex items-center">
                 <span className="w-3 h-0.5 bg-red-600 mr-2"></span>
                 <span>ELA Scan Direction</span>
            </div>
        </div>
      </div>
    </div>
  );
};
