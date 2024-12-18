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

  ///// REVISIT THESE ASSUMPTIONS IF WE ADD FURTHER FUNCTIONALITY
  /// constant values:
  const percentDown = startingHomes[0].percentDownPayment;
  const percentAnnualHomeAppreciation = startingHomes[0].percentAnnualHomeAppreciation;
  const percentAnnualInterestRate = startingHomes[0].percentAnnualInterestRate;
  const loanTermYears = 30;

  const homes = []; // our list of all homes purchased either from user input or growth

  for (let month = 0; month <= projectionsYears * 12; month++) {
    // add any input homes to simulation homes if it is the correct month
    let newHomesAddedThisMonth = [];
    for (let home of startingHomes) {
      if (home.monthOfPurchase === month) {
        newHomesAddedThisMonth.push(home);
      }
    }
    startingHomes = startingHomes.filter((home) => home.monthOfPurchase !== month);

    //// check for possibility of buying a new home via a refinance
    //// cost of buying a new home is: currentHomeValue * (downPaymentPercenct + 7%)
    if (homes.length !== 0) {
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
              home.percentDown,
              home.percentAnnualInterestRate,
              home.loanTermYears,
              home.refinanceCost,
              Date.now()
            )
          );
        }
      }
    }
    homes.push(...newHomesAddedThisMonth);
  }

  const projectionMonth = projectionsYears * 12;

  console.log(`result home count: ${homes.length}`);
  for (let i = 0; i < homes.length; i++) {
    console.log(`potential payout: ${formatCurrency(homes[i].getPossibleRefinancePayout(projectionMonth))}`);
  }
  return homes;
};

export default runSimulation;
