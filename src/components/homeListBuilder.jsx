"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Info } from 'lucide-react';
import House from '@/lib/House'

export const HomeListBuilder = ({ onCalculate }) => {
    const [projectionYears, setProjectionYears] = useState(15);
    const [baseHomePrice, setBaseHomePrice] = useState(280000);
    const [percentAnnualHomeAppreciation, setPercentAnnualHomeAppreciation] = useState(5);
    const [homes, setHomes] = useState([]);
    const [growthStrategy, setGrowthStrategy] = useState("reinvestment");
    const [currentForm, setCurrentForm] = useState({
      monthOfPurchase: 0,
      percentDownPayment: 25,
      percentAnnualInterestRate: 6.5,
      loanTermYears: 30,
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
        const closingCosts = currentAppreciatedPrice * 0.07;
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
            growthStrategy,
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
        if (!percentAnnualHomeAppreciation || percentAnnualHomeAppreciation < 3 || percentAnnualHomeAppreciation > 7) {
            setError("Please enter a home value appreciation rate in the range of 3% to 7%");
            return;
        }
        onCalculate({ homes, projectionYears });
    };

    // return (
    //     <Card className="w-full max-w-4xl">
    //         <CardHeader>
    //             <CardTitle>Portfolio Growth Simulator</CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-6">
    //             {/* Simulation Settings Section */}
    //             <div className="rounded-lg border border-gray-200">
    //                 <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200">
    //                     <h3 className="text-lg font-semibold text-gray-900">Simulation Settings</h3>
    //                     <p className="text-sm text-gray-600">Configure global parameters for the entire simulation</p>
    //                 </div>
    //                 <div className="p-4 bg-white rounded-b-lg">
    //                     <div className="grid grid-cols-4 gap-4">
    //                         <div>
    //                             <label className="text-sm font-medium">Projection Timeframe (years)</label>
    //                             <div className="flex items-center gap-2 mt-1">
    //                                 <Input
    //                                     type="number"
    //                                     value={projectionYears}
    //                                     onChange={(e) => {
    //                                         const value = parseInt(e.target.value);
    //                                         setProjectionYears(isNaN(value) ? 5 : value);
    //                                         setHomes([]);
    //                                     }}
    //                                     className="w-full"
    //                                     min="5"
    //                                     step="1"
    //                                 />
    //                             </div>
    //                         </div>

    //                         <div>
    //                             <label className="text-sm font-medium">Base Home Price ($)</label>
    //                             <Input
    //                                 type="text"
    //                                 value={baseHomePrice ? Number(baseHomePrice).toLocaleString() : ''}
    //                                 onChange={(e) => {
    //                                     setBaseHomePrice(parseFloat(e.target.value.replace(/,/g, '')) || 0);
    //                                     setHomes([]);
    //                                 }}
    //                                 className="mt-1"
    //                             />
    //                         </div>                            

    //                         <div>
    //                             <label className="text-sm font-medium">Annual Appreciation (%)</label>
    //                             <Select
    //                                 value={percentAnnualHomeAppreciation.toString()}
    //                                 onValueChange={(value) => {
    //                                     setPercentAnnualHomeAppreciation(parseFloat(value));
    //                                     setHomes([]);
    //                                 }}
    //                             >
    //                                 <SelectTrigger className="mt-1">
    //                                     <SelectValue placeholder="Select appreciation rate" />
    //                                 </SelectTrigger>
    //                                 <SelectContent>
    //                                     {Array.from({ length: 9 }, (_, i) => 3 + i * 0.5).map((rate) => (
    //                                         <SelectItem key={rate} value={rate.toString()}>
    //                                             {rate.toFixed(1)}%
    //                                         </SelectItem>
    //                                     ))}
    //                                 </SelectContent>
    //                             </Select>
    //                         </div>

    //                         <div>
    //                             <label className="text-sm font-medium">Growth Strategy</label>
    //                             <Select
    //                                 defaultValue="reinvestment"
    //                                 onValueChange={(value) => {
    //                                     setGrowthStrategy(value === "reinvestment" ? true : false);
    //                                     setHomes([]);
    //                                 }}
    //                             >
    //                                 <SelectTrigger className="mt-1">
    //                                     <SelectValue placeholder="Select growth strategy" />
    //                                 </SelectTrigger>
    //                                 <SelectContent>
    //                                     <SelectItem value="reinvestment">
    //                                         <div>
    //                                             <div className="font-medium">Equity Reinvestment</div>
    //                                             <div className="text-sm text-gray-500">Use refinancing to purchase additional properties</div>
    //                                         </div>
    //                                     </SelectItem>
    //                                     <SelectItem value="building">
    //                                         <div>
    //                                             <div className="font-medium">Equity Building</div>
    //                                             <div className="text-sm text-gray-500">Let properties grow equity without refinancing</div>
    //                                         </div>
    //                                     </SelectItem>
    //                                 </SelectContent>
    //                             </Select>
    //                         </div>

    //                     </div>
    //                 </div>
    //             </div>

                

    //             {/* Property Configuration Section */}
    //             <div className="rounded-lg border border-gray-200">
    //                 <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200">
    //                     <h3 className="text-lg font-semibold text-gray-900">Property Configuration</h3>
    //                     <p className="text-sm text-gray-600">Add individual properties to your portfolio</p>
    //                 </div>
    //                 <div className="p-4 bg-white rounded-b-lg space-y-6">
    //                     <div className="grid grid-cols-3 gap-4">
    //                         <div>
    //                             <label className="text-sm font-medium">Down Payment (%)</label>
    //                             <Input
    //                                 type="number"
    //                                 name="percentDownPayment"
    //                                 value={currentForm.percentDownPayment}
    //                                 onChange={handleInputChange}
    //                                 className="mt-1"
    //                                 step="0.1"
    //                             />
    //                         </div>
                            
    //                         <div>
    //                             <label className="text-sm font-medium">Loan Term (Years)</label>
    //                             <Select
    //                                 name="loanTermYears"
    //                                 value={currentForm.loanTermYears.toString()}
    //                                 onValueChange={(value) => {
    //                                     setCurrentForm(prev => ({
    //                                         ...prev,
    //                                         loanTermYears: parseInt(value)
    //                                     }));
    //                                 }}
    //                             >
    //                                 <SelectTrigger className="mt-1">
    //                                     <SelectValue placeholder="Select loan term" />
    //                                 </SelectTrigger>
    //                                 <SelectContent>
    //                                     <SelectItem value="15">15 years</SelectItem>
    //                                     <SelectItem value="20">20 years</SelectItem>
    //                                     <SelectItem value="30">30 years</SelectItem>
    //                                 </SelectContent>
    //                             </Select>
    //                         </div>

    //                         <div>
    //                             <label className="text-sm font-medium">Months from Now</label>
    //                             <Input
    //                                 type="number"
    //                                 name="monthOfPurchase"
    //                                 value={currentForm.monthOfPurchase}
    //                                 onChange={handleInputChange}
    //                                 className="mt-1"
    //                                 min={0}
    //                             />
    //                         </div>

    //                         <div>
    //                             <label className="text-sm font-medium">Purchase Price</label>
    //                             <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-200 px-3 py-2 text-sm">
    //                                 ${Math.round(currentAppreciatedPrice).toLocaleString()}{" "}
    //                                 {currentForm.monthOfPurchase > 0 
    //                                     ? `after ${currentForm.monthOfPurchase} months of appreciation` 
    //                                     : 'base price'}
    //                             </div>
    //                         </div>

    //                         <div className="col-span-2">
    //                             <label className="text-sm font-medium">Total Out of Pocket</label>
    //                             <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-200 px-3 py-2 text-sm">
    //                                 ${Math.round(totalOutOfPocket).toLocaleString()}{" "}
    //                                 <span className="text-gray-600 ml-2">
    //                                     (includes {currentForm.percentDownPayment}% down payment and 7% closing costs)
    //                                 </span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

    //                     <div className="flex justify-end">
    //                         <Button onClick={addHome}>Add Property</Button>
    //                     </div>

    //                     {/* Added Properties List */}
    //                     <div className="space-y-4">
    //                         <div className="text-sm font-medium">Added Properties:</div>
    //                         {homes.length === 0 ? (
    //                             <div className="text-sm text-gray-500">No properties added yet</div>
    //                         ) : (
    //                             <div className="space-y-2">
    //                                 {homes.map((home) => (
    //                                     <div
    //                                         key={home.id}
    //                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    //                                     >
    //                                         <div className="space-y-1">
    //                                             <div>
    //                                                 <span className="font-medium">
    //                                                     ${Math.round(home.initialHomePrice).toLocaleString()}
    //                                                 </span>
    //                                                 <span className="text-gray-600 ml-2">
    //                                                     {home.monthOfPurchase} months from now
    //                                                 </span>
    //                                             </div>
    //                                             <div className="text-sm text-gray-600">
    //                                                 {home.percentDownPayment}% down,{" "}
    //                                                 {home.loanTermYears}yr term
    //                                             </div>
    //                                         </div>
    //                                         <Button
    //                                             variant="ghost"
    //                                             size="sm"
    //                                             onClick={() => removeHome(home.id)}
    //                                             className="text-red-500 hover:text-red-700"
    //                                         >
    //                                             <Trash2 className="h-4 w-4" />
    //                                         </Button>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         )}
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="flex justify-end">
    //                 <Button
    //                     onClick={handleCalculate}
    //                     disabled={homes.length === 0}
    //                     className="w-32 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
    //                 >
    //                     Calculate
    //                 </Button>
    //             </div>
    //         </CardContent>
    //     </Card>
    // );

    return (
        <div className="w-full max-w-8xl grid grid-cols-3 gap-6">
            {/* Main Settings Card - Takes up 2/3 of the space */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Portfolio Growth Simulator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Simulation Settings Section */}
                    <div className="rounded-lg border border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Simulation Settings</h3>
                            <p className="text-sm text-gray-600">Configure global parameters for the entire simulation</p>
                        </div>
                        <div className="p-4 bg-white rounded-b-lg">
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Projection Timeframe (years)</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input
                                            type="number"
                                            value={projectionYears}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setProjectionYears(isNaN(value) ? 5 : value);
                                                setHomes([]);
                                            }}
                                            className="w-full"
                                            min="5"
                                            step="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Base Home Price ($)</label>
                                    <Input
                                        type="text"
                                        value={baseHomePrice ? Number(baseHomePrice).toLocaleString() : ''}
                                        onChange={(e) => {
                                            setBaseHomePrice(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                            setHomes([]);
                                        }}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Annual Appreciation (%)</label>
                                    <Select
                                        value={percentAnnualHomeAppreciation.toString()}
                                        onValueChange={(value) => {
                                            setPercentAnnualHomeAppreciation(parseFloat(value));
                                            setHomes([]);
                                        }}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select appreciation rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 9 }, (_, i) => 3 + i * 0.5).map((rate) => (
                                                <SelectItem key={rate} value={rate.toString()}>
                                                    {rate.toFixed(1)}%
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Growth Strategy</label>
                                    <Select
                                        defaultValue="reinvestment"
                                        onValueChange={(value) => {
                                            setGrowthStrategy(value === "reinvestment" ? true : false);
                                            setHomes([]);
                                        }}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select growth strategy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="reinvestment">
                                                <div>
                                                    <div className="font-medium">Equity Reinvestment</div>
                                                    <div className="text-sm text-gray-500">Use refinancing to purchase additional properties</div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="building">
                                                <div>
                                                    <div className="font-medium">Equity Building</div>
                                                    <div className="text-sm text-gray-500">Let properties grow equity without refinancing</div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Configuration Section */}
                    <div className="rounded-lg border border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Property Configuration</h3>
                            <p className="text-sm text-gray-600">Add individual properties to your portfolio</p>
                        </div>
                        <div className="p-4 bg-white rounded-b-lg space-y-6">
                            <div className="grid grid-cols-3 gap-4">
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
                                    <label className="text-sm font-medium">Loan Term (Years)</label>
                                    <Select
                                        name="loanTermYears"
                                        value={currentForm.loanTermYears.toString()}
                                        onValueChange={(value) => {
                                            setCurrentForm(prev => ({
                                                ...prev,
                                                loanTermYears: parseInt(value)
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select loan term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 years</SelectItem>
                                            <SelectItem value="20">20 years</SelectItem>
                                            <SelectItem value="30">30 years</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-200 px-3 py-2 text-sm">
                                        ${Math.round(currentAppreciatedPrice).toLocaleString()}{" "}
                                        {currentForm.monthOfPurchase > 0 
                                            ? `after ${currentForm.monthOfPurchase} months of appreciation` 
                                            : 'base price'}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Total Out of Pocket</label>
                                    <div className="mt-1 flex h-10 w-full rounded-md border border-input bg-gray-200 px-3 py-2 text-sm">
                                        ${Math.round(totalOutOfPocket).toLocaleString()}{" "}
                                        <span className="text-gray-600 ml-2">
                                            (includes {currentForm.percentDownPayment}% down payment and 7% closing costs)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            <div className="flex justify-end">
                                <Button onClick={addHome}>Add Property</Button>
                            </div>

                            {/* Added Properties List */}
                            <div className="space-y-4">
                                <div className="text-sm font-medium">Added Properties:</div>
                                {homes.length === 0 ? (
                                    <div className="text-sm text-gray-500">No properties added yet</div>
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
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={homes.length === 0}
                            className="w-32 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
                        >
                            Calculate
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Explanation Card - Takes up 1/3 of the space */}
            <Card className="h-fit sticky top-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        How It Works
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <h3 className="font-semibold text-orange-800 mb-2">Portfolio Growth Simulation</h3>
                            <p className="text-orange-900">
                                This simulator helps you visualize how a real estate portfolio could grow over time through property appreciation and strategic refinancing.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Key Concepts</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-gray-900">Property Appreciation</h4>
                                    <p className="text-gray-600">Properties increase in value annually based on the appreciation rate you select. This growth compounds over time.</p>
                                    <h4 className="font-medium text-gray-900">Equity Focused</h4>
                                    <p className="text-gray-600">This simulation is concerned with showing equity growth. It works on the base assumption that rent roughly cancels out with the mortgage payment and home maintenance. In DFY markets it is typically the case that rent exceeds these slightly but we won't be concerned with that here.</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900">Growth Strategies</h4>
                                    <p className="text-gray-600">Choose between two approaches:</p>
                                    <ul className="mt-2 space-y-2 pl-4">
                                        <li className="text-gray-600">
                                            <span className="font-medium text-gray-900">Equity Reinvestment:</span> Use accumulated equity to purchase additional properties through refinancing when sufficient equity has built up
                                        </li>
                                        <li className="text-gray-600">
                                            <span className="font-medium text-gray-900">Equity Building:</span> Focus on paying down mortgages and building equity in existing properties without leveraging for new purchases
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900">Timeline Planning</h4>
                                    <p className="text-gray-600">Plan property purchases across your projection timeline. Earlier purchases benefit from longer appreciation periods and can potentially be used for future down payments.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="font-semibold text-blue-800 mb-2">Pro Tips</h3>
                            <ul className="space-y-2 text-blue-900">
                                <li>• Start with a realistic base home price for your target market</li>
                                <li>• Consider using conservative appreciation rates (4-5%) for long-term projections</li>
                                <li>• Plan purchases strategically to maximize compound growth</li>
                                <li>• Remember that higher down payments reduce monthly costs but require more upfront capital</li>
                                <li>• Balance loan terms with your investment strategy - shorter terms build equity faster but have higher payments and may break our rent cancelling mortgage payments assumption</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};

export default HomeListBuilder;