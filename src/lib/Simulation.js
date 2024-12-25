///// takes the list of homes from homeListBuilder,
///// runs simulation for specified number of years,
///// returns result object with all useful info from the simulation.

import House from "@/lib/House";

// Currrency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const runSimulation = (startingHomes, projectionYears) => {
  if (startingHomes.length === 0) {
    const result = null;
    return result;
  }

  // find the total out of pocket costs from these starting homes
  let totalOutOfPocket = 0;
  startingHomes.forEach((home) => {
    totalOutOfPocket += (home.initialHomePrice * (home.percentDownPayment + 7)) / 100;
  });

  const homes = []; // our list of all homes purchased either from user input or growth

  // Array with yearly values for making graphs and showing results.
  let graphingData = [];

  for (let month = 0; month <= projectionYears * 12; month++) {
    // add any input homes to simulation homes if it is the correct month to do so
    let newHomesAddedThisMonth = [];
    for (let home of startingHomes) {
      if (home.monthOfPurchase === month) {
        newHomesAddedThisMonth.push(home);
      }
    }
    startingHomes = startingHomes.filter((home) => home.monthOfPurchase !== month);

    //// check for possibility of buying a new home via a refinance
    //// cost of buying a new home is: currentHomeValue * (downPayment% + 7%)
    if (homes.length !== 0) {
      for (let home of homes) {
        const fractionOfHomePriceToGetIn = (home.percentDownPayment + 7) / 100;
        const costToGetIntoNewHome = home.getCurrentHomeValue(month) * fractionOfHomePriceToGetIn;
        if (home.willReinvest && home.getPossibleRefinancePayout(month) > costToGetIntoNewHome) {
          home.doARefinance(month, home.percentAnnualInterestRate, 25, home.loanTermYears);
          newHomesAddedThisMonth.push(
            new House(
              month,
              home.getCurrentHomeValue(month),
              home.percentAnnualHomeAppreciation,
              home.percentDownPayment,
              home.percentAnnualInterestRate,
              home.loanTermYears,
              home.willReinvest,
              Date.now()
            )
          );
        }
      }
    }
    homes.push(...newHomesAddedThisMonth);

    const propertyCountEntry = homes.length;
    let portfolioValueEntry = 0;
    let debtEntry = 0;
    let equityEntry = 0;

    for (let home of homes) {
      const homeValue = home.getCurrentHomeValue(month);
      let homeDebt = 0;
      if (month - home.monthOfLatestMortgageOrRefinance < home.schedule.length) {
        // this method of checking debt only works if the home is refinancing before the ammortization schedule ends
        homeDebt = home.schedule[month - home.monthOfLatestMortgageOrRefinance].remainingBalance;
      }
      portfolioValueEntry += homeValue;
      debtEntry += homeDebt;
      equityEntry += homeValue - homeDebt;
    }

    const dataPoint = {
      month: month,
      year: Math.floor(month / 12),
      propertyCount: propertyCountEntry,
      portfolioValue: portfolioValueEntry,
      debt: debtEntry,
      equity: equityEntry,
      equityIncome:
        (((equityEntry === 0 ? 0 : portfolioValueEntry * homes[0].percentAnnualHomeAppreciation) / 100) * 0.75 -
          homes[0].getCurrentRefiCost(month)) /
        12,
    };
    graphingData.push(dataPoint);
  }

  const annualPercentReturnFromEquity =
    (Math.pow(graphingData[projectionYears * 12].equity / totalOutOfPocket, 1 / projectionYears) - 1) * 100;

  const results = {
    homes: homes,
    graphingData: graphingData,
    totalOutOfPocket: totalOutOfPocket,
    annualPercentReturnFromEquity: annualPercentReturnFromEquity,
  };

  return results;
};

export default runSimulation;
