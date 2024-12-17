///// takes the list of homes from homeListBuilder,
///// runs simulation for specified number of years,
///// returns result object with all useful info from the simulation.

// Currrency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const runSimulation = (startingHomes, projectionsYears) => {
  const homes = []; // our list of all homes purchased either from user input or growth

  for (let month = 0; month <= projectionsYears * 12; month++) {
    // add any input homes to simulation homes if it is the correct month
    for (let home of startingHomes) {
      if (home.monthOfPurchase === month) {
        homes.push(home);
      }
    }
    startingHomes = startingHomes.filter((home) => home.monthOfPurchase !== month);
  }
};

export default runSimulation;
