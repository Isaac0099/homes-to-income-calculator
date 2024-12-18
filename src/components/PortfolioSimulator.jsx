"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HomeListBuilder } from "@/components/homeListBuilder";
import { SimulationResults } from "@/components/SimulationResults";
import { runSimulation } from "@/lib/Simulation";

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
