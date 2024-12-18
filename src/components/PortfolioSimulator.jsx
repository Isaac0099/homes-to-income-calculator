"use client";
import React, { useState } from "react";
import { HomeListBuilder } from "@/components/homeListBuilder";
import { SimulationResults } from "@/components/SimulationResults";
import { runSimulation } from "@/lib/Simulation";

// Parent component to manage state
const PortfolioSimulator = () => {
  const [simulationData, setSimulationData] = useState(null);

  const handleCalculate = (data) => {
    const results = runSimulation(data.homes, data.projectionYears);
    console.log(results);
    setSimulationData({...data, results: results})
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
          results={simulationData.results}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default PortfolioSimulator;
