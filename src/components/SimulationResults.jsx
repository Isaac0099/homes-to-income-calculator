import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Home, TrendingUp, Wallet } from 'lucide-react';

// Currrency formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

export const SimulationResults = ({ homes, projectionYears, results, onReset }) => {

  const KeyMetricCard = ({ icon: Icon, title, value, subtext }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-100 rounded-full">
            <Icon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtext && <p className="text-sm text-gray-600">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Portfolio Growth Projection</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <KeyMetricCard
              icon={Home}
              title="Total Properties"
              value={results.homes.length}
              subtext={`Starting with ${homes.length} properties`}
            />
            <KeyMetricCard
              icon={DollarSign}
              title="Total Portfolio Value"
              value={`$${Math.round(results.graphingData[projectionYears].portfolioValue / 1000000)}M`}
              subtext={`Projected in ${projectionYears} years`}
            />
            <KeyMetricCard
              icon={TrendingUp}
              title="Annual ROI"
              value={`${results.annualPercentReturnFromEquity.toFixed(1)}%`}
              subtext={`Average return on investment \n (based on equity after ${projectionYears} years)`}
            />
            <KeyMetricCard
              icon={Wallet}
              title="Total Out of Pocket"
              value={formatCurrency(results.totalOutOfPocket)}
              subtext="Money you spent buying homes"
            />
          </div>

          {/* Tabs for different charts */}
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio Growth</TabsTrigger>
              <TabsTrigger value="properties">Properties Count Over Time</TabsTrigger>
              <TabsTrigger value="cashflow">Equity Over Time</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.graphingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value) => [`$${(value/1000000).toFixed(2)}M`]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="properties" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.graphingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, "Properties"]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="propertyCount" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="cashflow" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.graphingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${(value/1000).toFixed(1)}k`]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-[#f17422ff] text-white rounded-md hover:bg-[#f4a46f] transition-colors"
        >
          Create New Simulation
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;