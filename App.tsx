
import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { SimulationCanvas } from './components/SimulationCanvas';
import { Header } from './components/Header';
import { useShrinkageCalculator } from './hooks/useShrinkageCalculator';
import type { SimulationParams } from './types';
import { DEFAULT_PARAMS } from './constants';

const App: React.FC = () => {
  // inputParams tracks the form state (what the user is editing)
  const [inputParams, setInputParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  
  // activeParams tracks the state currently being simulated
  // Initialized with default so something shows up on load
  const [activeParams, setActiveParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  const simulationResults = useShrinkageCalculator(activeParams);

  const handleRunSimulation = () => {
    setActiveParams(inputParams);
  };

  return (
    <div className="min-h-screen bg-base-200 text-content-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ControlPanel 
              params={inputParams} 
              onParamsChange={setInputParams}
              onRunSimulation={handleRunSimulation}
            />
          </div>
          <div className="lg:col-span-2">
            <SimulationCanvas results={simulationResults} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-content-200 text-sm">
        <p>&copy; 2024 Advanced Display Technologies. Simulation based on public technical analysis.</p>
      </footer>
    </div>
  );
};

export default App;
