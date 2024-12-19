"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import House from '@/lib/House'

export const HomeListBuilder = ({ onCalculate }) => {
    const [projectionYears, setProjectionYears] = useState(15);
    const [baseHomePrice, setBaseHomePrice] = useState(280000);
    const [percentAnnualHomeAppreciation, setPercentAnnualHomeAppreciation] = useState(5);
    const [homes, setHomes] = useState([]);
    const [currentForm, setCurrentForm] = useState({
      monthOfPurchase: 0,
      percentDownPayment: 25,
      percentAnnualInterestRate: 6.5,
      loanTermYears: 30,
      refinanceCost: 7000,
    });
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const rawValue = value.replace(/,/g, '');
        
        setCurrentForm((prev) => ({
          ...prev,
          [name]: value === "" ? "" : Math.abs(parseFloat(rawValue))
        }));
    };

    const calculateAppreciatedPrice = (months) => {
        const yearFraction = months / 12;
        return baseHomePrice * Math.pow(1 + (percentAnnualHomeAppreciation / 100), yearFraction);
    };

    const currentAppreciatedPrice = useMemo(() => {
        return calculateAppreciatedPrice(currentForm.monthOfPurchase);
    }, [currentForm.monthOfPurchase, baseHomePrice, percentAnnualHomeAppreciation]);

    const totalOutOfPocket = useMemo(() => {
        const downPaymentAmount = currentAppreciatedPrice * (currentForm.percentDownPayment / 100);
        const closingCosts = currentAppreciatedPrice * 0.07; // 7% for closing costs
        return downPaymentAmount + closingCosts;
    }, [currentAppreciatedPrice, currentForm.percentDownPayment]);
  
    const addHome = () => {
        setError("");
        if (!currentForm.percentDownPayment || currentForm.percentDownPayment < 1 || currentForm.percentDownPayment > 100) {
            setError("Please enter a down payment percent between 1 and 100");
            return;
        }
        if (!currentForm.loanTermYears || (currentForm.loanTermYears !== 15 && currentForm.loanTermYears !== 20 && currentForm.loanTermYears !== 30)) {
            setError("Please enter loan term that is either 15, 20, or 30 years");
            return;
        }
        if (!currentForm.refinanceCost || currentForm.refinanceCost < 0 || currentForm.percentDownPayment > 15_000) {
            setError("Please enter a refinance cost between $0 and $15,000");
            return;
        }
        if (currentForm.monthOfPurchase === "" || currentForm.monthOfPurchase < 0 || currentForm.monthOfPurchase > projectionYears * 12) {
            setError("Please enter a purchase month from 0 to the month the simulation ends");
            return;
        }
        const newHome = new House(
            currentForm.monthOfPurchase, 
            currentAppreciatedPrice,
            percentAnnualHomeAppreciation,
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
        setError("");
        if (!projectionYears || projectionYears < 5 || projectionYears > 80) {
            setError("Please enter a projection year number between 5 and 80");
            return;
        }
        if (!baseHomePrice || baseHomePrice < 100_000 || baseHomePrice > 1_000_000) {
            setError("Please enter a base home price between 100,000 and 1,000,000");
            return;
        }
        if (!percentAnnualHomeAppreciation || percentAnnualHomeAppreciation < 1 || percentAnnualHomeAppreciation > 100) {
            setError("Please enter a home value appreciation rate between 0% and 100");
            return;
        }
        onCalculate({ homes, projectionYears });
    };
  
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Portfolio Growth Simulator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Global Settings Section */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Projection Timeframe</label>
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    type="number"
                                    value={projectionYears}
                                    onChange={(e) => {
                                        const value = parseInt=(e.target.value);
                                        setProjectionYears((isNaN(value)) ? 5 : value)
                                        setHomes([]); // rest homes when projection year changes}
                                    }}
                                    className="w-full"
                                    min="5"
                                    step="1"
                                />
                                <span className="text-sm text-gray-600 whitespace-nowrap">years</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Base Home Price ($)</label>
                            <Input
                                type="text"
                                value={baseHomePrice ? Number(baseHomePrice).toLocaleString() : ''}
                                onChange={(e) => {
                                    setBaseHomePrice(parseFloat(e.target.value.replace(/,/g, '')) || 0); // regex is for adding commas to numbers
                                    setHomes([]); // reset homes when base price changes
                                }}
                                className="mt-1"
                                onKeyPress={(e) => {
                                    if (!/[\d.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Annual Appreciation (%)</label>
                            <Input
                                type="number"
                                value={percentAnnualHomeAppreciation}
                                onChange={(e) => {
                                    setPercentAnnualHomeAppreciation(parseFloat(e.target.value));
                                    setHomes([]);
                                }}
                                className="mt-1"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Home-specific settings */}
                <div className="grid grid-cols-2 gap-4">
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
                            min={0}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Purchase Price</label>
                        <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background">
                            <div className="font-medium text-s">
                                ${Math.round(currentAppreciatedPrice).toLocaleString()}{" "}{currentForm.monthOfPurchase > 0 
                                    ? ` after ${currentForm.monthOfPurchase} months of appreciation` 
                                    : 'base price'}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm font-medium">Total Out of Pocket</label>
                        <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background">
                            <div className="font-medium text-s">
                                ${Math.round(totalOutOfPocket).toLocaleString()}{" "}
                                <span className="text-gray-600">
                                    (includes {currentForm.percentDownPayment}% down payment and 7% closing costs)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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
                                                ${Math.round(home.initialHomePrice).toLocaleString()}
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
                        className="w-32 bg-[#f17422ff] disabled:bg-gray100"
                    >
                        Calculate
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HomeListBuilder;