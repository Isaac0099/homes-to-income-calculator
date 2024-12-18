import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Home, TrendingUp, Wallet } from 'lucide-react';

export const SimulationResults = ({ homes, projectionYears, onReset }) => {
  // Sample data structure (replace with your actual simulation results)
  const portfolioGrowth = Array.from({ length: projectionYears + 1 }, (_, year) => ({
    year,
    totalEquity: 500000 * Math.pow(1.12, year),
    totalProperties: Math.min(Math.floor(year / 2) + homes.length, 15),
    netWorth: 600000 * Math.pow(1.15, year),
  }));

  const KeyMetricCard = ({ icon: Icon, title, value, subtext }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
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
              value={portfolioGrowth[projectionYears].totalProperties}
              subtext={`Starting with ${homes.length} properties`}
            />
            <KeyMetricCard
              icon={DollarSign}
              title="Total Portfolio Value"
              value={`$${Math.round(portfolioGrowth[projectionYears].netWorth / 1000000)}M`}
              subtext="Projected in 30 years"
            />
            <KeyMetricCard
              icon={TrendingUp}
              title="Annual ROI"
              value="15.2%"
              subtext="Average return on investment"
            />
            <KeyMetricCard
              icon={Wallet}
              title="Monthly Cash Flow"
              value="$12,450"
              subtext="Projected passive income"
            />
          </div>

          {/* Tabs for different charts */}
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio Growth</TabsTrigger>
              <TabsTrigger value="properties">Properties Over Time</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value) => [`$${(value/1000000).toFixed(2)}M`]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netWorth" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="properties" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, "Properties"]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="totalProperties" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="cashflow" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${(value/1000).toFixed(1)}k`]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalEquity" 
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Simulation
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;