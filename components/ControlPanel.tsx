
import React from 'react';
import type { SimulationParams } from '../types';
import { ScanDirection } from '../types';
import { DEFAULT_PARAMS, DEFAULT_CORRECTION_FACTOR } from '../constants';

interface ControlPanelProps {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
  onRunSimulation: () => void;
}

const InfoIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ params, onParamsChange, onRunSimulation }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ ...params, [e.target.name]: Number(e.target.value) });
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ ...params, [e.target.name]: e.target.checked });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onParamsChange({ ...params, [e.target.name]: e.target.value as ScanDirection });
  };
  
  const resetToDefault = () => {
    onParamsChange({ ...DEFAULT_PARAMS, correctionFactor: DEFAULT_CORRECTION_FACTOR });
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-brand-primary">Simulation Controls</h2>
        <button
          onClick={resetToDefault}
          className="text-xs font-semibold text-brand-secondary hover:text-brand-dark transition-colors border border-brand-secondary px-2 py-1 rounded"
        >
          RESET
        </button>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Glass Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="block text-xs font-bold text-content-200 uppercase mb-1">Glass Width (mm)</label>
            <input
              type="number"
              id="width"
              name="width"
              value={params.width}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent bg-white text-black font-medium"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-xs font-bold text-content-200 uppercase mb-1">Glass Height (mm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={params.height}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent bg-white text-black font-medium"
            />
          </div>
        </div>

        {/* ELA Settings */}
        <div className="p-4 bg-base-200 rounded-lg border border-base-300">
            <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center">
                ELA Process Settings
            </h3>
            
            <div className="mb-4">
              <label htmlFor="scanDirection" className="block text-xs font-medium text-content-200 mb-1">Scan Direction</label>
              <select
                  id="scanDirection"
                  name="scanDirection"
                  value={params.scanDirection}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent bg-white text-black"
              >
                  <option value={ScanDirection.LONG_AXIS}>Long Axis (Vertical)</option>
                  <option value={ScanDirection.SHORT_AXIS}>Short Axis (Horizontal)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-content-100 flex items-center">
                Block Metal Layer (BML)
                <span className="group relative ml-2">
                <InfoIcon/>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    BML acts as a heat sink (138 W/m·K), diffusing heat laterally (~255nm) and reducing peak PI temperature, thus lowering shrinkage.
                </div>
                </span>
            </span>
            <label htmlFor="hasBML" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="hasBML" name="hasBML" checked={params.hasBML} onChange={handleToggleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-light peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
            </div>
        </div>

        {/* Physics Correction */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
             <h3 className="text-sm font-bold text-brand-dark mb-3">Physics Model Correction</h3>
             <div>
                <div className="flex justify-between mb-1">
                    <label htmlFor="correctionFactor" className="block text-xs font-medium text-content-200">Process Factor: <span className="font-bold text-brand-primary">{params.correctionFactor.toFixed(1)}x</span></label>
                </div>
                <input
                    type="range"
                    id="correctionFactor"
                    name="correctionFactor"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={params.correctionFactor}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <p className="text-[10px] text-content-200 mt-1">
                    * Fine-tune the computed Strain based on experimental variations (e.g., Laser Energy Density, Overlap %).
                </p>
            </div>
        </div>

        <button
            onClick={onRunSimulation}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded shadow-md transition-colors flex items-center justify-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            RUN SIMULATION
        </button>

      </div>
    </div>
  );
};
