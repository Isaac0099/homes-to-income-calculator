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

export const runSimulation = (startingHomes, projectionsYears) => {
  if (startingHomes.length === 0) {
    const result = null;
    return result;
  }
  const result = {};

  const homes = []; // our list of all homes purchased either from user input or growth

  // Arrays with yearly value for making graphs and showing results.
  const totalEquity = [];
  const totalProperties = [];
  const totalPortfolioValue = [];
  const totalDebt = [];

  for (let month = 0; month <= projectionsYears * 12; month++) {
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
      if (projectionsYears * 12 - month > 24) {
        // we stop doing refinances for the last two years of the growth period to build equity.
        for (let home of homes) {
          const fractionOfHomePriceToGetIn = (home.percentDownPayment + 7) / 100;
          const costToGetIntoNewHome = home.getCurrentHomeValue(month) * fractionOfHomePriceToGetIn;
          if (home.getPossibleRefinancePayout(month) > costToGetIntoNewHome) {
            home.doARefinance(month, home.percentAnnualInterestRate, 25, home.loanTermYears);
            newHomesAddedThisMonth.push(
              new House(
                month,
                home.getCurrentHomeValue(month),
                home.percentAnnualHomeAppreciation,
                home.percentDownPayment,
                home.percentAnnualInterestRate,
                home.loanTermYears,
                home.refinanceCost,
                Date.now()
              )
            );
          }
        }
      }
    }
    homes.push(...newHomesAddedThisMonth);

    // for every year, add results to graphing arrays
    if (month % 12 === 0) {
      const propertyCountEntry = homes.length;
      const portfolioValueEntry = 0;
      const debtEntry = 0;
      const equityEntry = 0;

      for (let home of homes) {
        const homeValue = home.getCurrentHomeValue(month);
        const homeDebt = home.schedule[month - home.monthOfLatestMortgageOrRefinance];
        portfolioValueEntry += homeValue;
        debtEntry += homeDebt;
        equityEntry += homeValue - homeDebt;
      }

      totalProperties.push(propertyCountEntry);
      totalPortfolioValue.push(portfolioValueEntry);
      totalDebt.push(debtEntry);
      totalEquity.push(equityEntry);
    }
  }

  result = {
    homes: homes,
    totalProperties: totalProperties,
    totalPortfolioValue: totalPortfolioValue,
    totalDebt: totalDebt,
    toalEquity: totalEquity,
  };

  return results;
};

export default runSimulation;
