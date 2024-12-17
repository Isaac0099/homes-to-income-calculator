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
    const result = [];
    return result;
  }

  ///// REVISIT THESE ASSUMPTIONS IF WE ADD FURTHER FUNCTIONALITY
  /// constant values:
  const percentDown = startingHomes[0].percentDownPayment;
  const percentAnnualHomeAppreciation = startingHomes[0].percentAnnualHomeAppreciation;
  const fractionOfHomePriceToGetIn = (percentDown + 7) / 100;
  const percentAnnualInterestRate = startingHomes[0].percentAnnualInterestRate;

  const homes = []; // our list of all homes purchased either from user input or growth
  console.log(startingHomes);

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
    // cost of buying a new home is: currentHomeValue * (downPaymentPercenct + 7%)
    if (homes.length !== 0) {
      const currentHomeValue = homes[0].getCurrentHomeValue(month);
      const costToGetIntoNewHome = currentHomeValue * fractionOfHomePriceToGetIn;
      for (let home of homes) {
        if (home.getPossibleRefinancePayout(month) > costToGetIntoNewHome) {
          home.doARefinance(month);
          newHomesAddedThisMonth.push(
            new House(
              month,
              currentHomeValue,
              percentAnnualHomeAppreciation,
              percentDown,
              percentAnnualInterestRate,
              30,
              homes[0].refinanceCost,
              Date.now()
            )
          );
        }
      }
    }

    /////

    homes.push(...newHomesAddedThisMonth);
  }

  console.log(`result homes: ${homes.length}`);
  return homes;
};

export default runSimulation;
