
import HomeListBuilder from "@/components/ui/homeListBuilder"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import {
    Calculator,
    Info,
    Settings,
    Percent,
    DollarSign,
    AlertCircle,
    Home,
    Calendar,
  } from "lucide-react";


export default function HomeAdder(){
    return(
        <>
            <HomeListBuilder />
            {/* <Accordion type="single" collapsible className="md:col-span-2 w-full">
            <AccordionItem value="settings">
            <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Settings
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                    <Label>Home Price</Label>
                    <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="number"
                        value={homePrice}
                        onChange={(e) =>
                        setHomePrice(parseFloat(e.target.value))
                        }
                        className="pl-9"
                        min="0"
                    />
                    </div>
                </div>
                <div>
                    <Label>Down Payment (%)</Label>
                    <div className="relative">
                    <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) =>
                        setDownPaymentPercent(parseFloat(e.target.value))
                        }
                        min="0"
                        max="100"
                    />
                    </div>
                </div>
                <div>
                    <Label>Annual Appreciation (%)</Label>
                    <div className="relative">
                    <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="number"
                        value={propertyAppreciation}
                        onChange={(e) =>
                        setPropertyAppreciation(
                            parseFloat(e.target.value)
                        )
                        }
                        step="0.1"
                        min="0"
                    />
                    </div>
                </div> 
                <div>
                    <Label>Inflation Rate (%)</Label>
                    <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) =>
                        setInflationRate(parseFloat(e.target.value))
                    }
                    min="1"
                    />
                </div>
                <div>
                    <Label>Refinance Cost</Label>
                    <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="number"
                        value={refinanceCost}
                        onChange={(e) =>
                        setRefinanceCost(parseFloat(e.target.value))
                        }
                        className="pl-9"
                        min="0"
                    />
                    </div>
                </div>
                <div>
                    <Label>Loan Term (Years)</Label>
                    <Input
                    type="number"
                    value={loanTermYears}
                    onChange={(e) =>
                        setLoanTermYears(parseFloat(e.target.value))
                    }
                    min="1"
                    />
                </div>
                </div>
            </AccordionContent>
            </AccordionItem>
            </Accordion> */}
        </>
    )
}