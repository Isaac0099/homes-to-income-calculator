"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import House from '@/lib/House'

export const HomeListBuilder = ({ onCalculate }) => {
    const [projectionYears, setProjectionYears] = useState(30);
    const [homes, setHomes] = useState([]);
    const [currentForm, setCurrentForm] = useState({
      monthOfPurchase: 0,
      homePrice: 280000,
      percentAnnualHomeAppreciation: 5,
      percentDownPayment: 25,
      percentAnnualInterestRate: 6.5,
      loanTermYears: 30,
      refinanceCost: 7000,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Remove commas and convert to number
        const rawValue = value.replace(/,/g, '');
        
        setCurrentForm((prev) => ({
          ...prev,
          [name]: parseFloat(rawValue) || '',  // Use empty string if parsing fails
        }));
      };
  
    const addHome = () => {
      // const newHome = {
      //   ...currentForm,
      //   id: Date.now(),
      //   index: homes.length,
      // };
      const newHome = new House(
        currentForm.monthOfPurchase, 
        currentForm.homePrice,
        currentForm.percentAnnualHomeAppreciation,
        currentForm.percentDownPayment,
        currentForm.percentAnnualInterestRate,
        currentForm.loanTermYears,
        currentForm.refinanceCost,
        Date.now()
      );
      setHomes([...homes, newHome]);
    };
  
    const removeHome = (id) => {
      setHomes(homes.filter((home) => home.id !== id));
    };
  
    const handleCalculate = () => {
      onCalculate({ homes, projectionYears });
    };
  
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Portfolio Growth Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Projection Timeframe Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium">Projection Timeframe</label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                type="number"
                value={projectionYears}
                onChange={(e) =>
                  setProjectionYears(parseFloat(e.target.value) || 0)
                }
                className="w-32"
                min="1"
                step="1"
              />
              <span className="text-sm text-gray-600">years</span>
            </div>
          </div>
  
          <Separator />
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Home Price ($)</label>
              <Input
                type="text"
                name="homePrice" 
                value={currentForm.homePrice ? Number(currentForm.homePrice).toLocaleString() : ''}
                onChange={handleInputChange}
                placeholder="Enter home price"
                className="mt-1"
                onKeyPress={(e) => {
                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault();
                    }
                }}
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">
                Annual Appreciation (%)
              </label>
              <Input
                type="number"
                name="percentAnnualHomeAppreciation"
                value={currentForm.percentAnnualHomeAppreciation}
                onChange={handleInputChange}
                className="mt-1"
                step="0.1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Down Payment (%)</label>
              <Input
                type="number"
                name="percentDownPayment"
                value={currentForm.percentDownPayment}
                onChange={handleInputChange}
                className="mt-1"
                step="0.1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Interest Rate (%)</label>
              <Input
                type="number"
                name="percentAnnualInterestRate"
                value={currentForm.percentAnnualInterestRate}
                onChange={handleInputChange}
                className="mt-1"
                step="0.1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Loan Term (Years)</label>
              <Input
                type="number"
                name="loanTermYears"
                value={currentForm.loanTermYears}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Refinance Cost ($)</label>
              <Input
                type="text"
                name="refinanceCost"
                value={currentForm.refinanceCost ? Number(currentForm.refinanceCost).toLocaleString() : ''}
                onChange={handleInputChange}
                placeholder="Enter refinance cost"
                className="mt-1"
                onKeyPress={(e) => {
                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault();
                    }
                }}
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Months from Now</label>
              <Input
                type="number"
                name="monthOfPurchase"
                value={currentForm.monthOfPurchase}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
  
          <div className="flex justify-end">
            <Button onClick={addHome}>Add Home</Button>
          </div>
  
          <div className="space-y-4">
            <div className="text-sm font-medium">Added Homes:</div>
            {homes.length === 0 ? (
              <div className="text-sm text-gray-500">No homes added yet</div>
            ) : (
              <div className="space-y-2">
                {homes.map((home) => (
                  <div
                    key={home.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium">
                          ${home.initialHomePrice.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {home.monthOfPurchase} months from now
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {home.percentDownPayment}% down,{" "}
                        {home.percentAnnualInterestRate}% APR,{" "}
                        {home.loanTermYears}yr term
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHome(home.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className="flex justify-end">
            <Button
              onClick={handleCalculate}
              disabled={homes.length === 0}
              className="w-32"
            >
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

export default HomeListBuilder;