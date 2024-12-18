"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HomeListBuilder } from "@/components/homeListBuilder";
import { SimulationResults } from "@/components/SimulationResults";
import { runSimulation } from "@/lib/Simulation";

// // Results component to show simulation
// const SimulationResults = ({ homes, projectionYears, onReset }) => {
//   return (
//     <div className="w-full max-w-2xl">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Simulation Results</h2>
//         <div className="mb-4">
//           <div className="text-sm text-gray-600">
//             Projecting {projectionYears} years with {homes.length} properties
//           </div>
//           {/* Add your simulation visualization/results here */}
//         </div>
//         <Button onClick={onReset} className="w-full">
//           Create New Simulation
//         </Button>
//       </div>
//     </div>
//   );
// };

// Parent component to manage state
const PortfolioSimulator = () => {
  const [simulationData, setSimulationData] = useState(null);

  const handleCalculate = (data) => {
    const result = runSimulation(data.homes, data.projectionYears);
    setSimulationData({...data, results: result})
  };

  const handleReset = () => {
    setSimulationData(null);
  };

  return (
    <div className="p-4">
      {!simulationData ? (
        <HomeListBuilder onCalculate={handleCalculate} />
      ) : (
        <SimulationResults
          homes={simulationData.homes}
          projectionYears={simulationData.projectionYears}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default PortfolioSimulator;
