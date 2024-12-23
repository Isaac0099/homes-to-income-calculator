import AmortizationCalculator from "./AmortizationCalculator.js";

class House {
  constructor(
    monthOfPurchase,
    homePrice,
    percentAnnualHomeAppreciation,
    percentDownPayment,
    percentAnnualInterestRate,
    loanTermYears,
    willReinvest,
    id
  ) {
    this.monthOfPurchase = monthOfPurchase;
    this.monthOfLatestMortgageOrRefinance = monthOfPurchase;
    this.initialHomePrice = homePrice;
    this.percentAnnualHomeAppreciation = percentAnnualHomeAppreciation;
    this.percentDownPayment = percentDownPayment;
    this.percentAnnualInterestRate = percentAnnualInterestRate;
    this.loanTermYears = loanTermYears;
    this.loanAmount = (homePrice * (100 - percentDownPayment)) / 100;
    this.amoCalc = new AmortizationCalculator();
    this.schedule = this.amoCalc.generateAmortizationSchedule(this.loanAmount, this.percentAnnualInterestRate, this.loanTermYears);
    this.refinanceSchedule = [];
    this.willReinvest = willReinvest;
    this.id = id;
  }

  getCurrentHomeValue(currentMonth) {
    const monthsSinceMortgageOrRefinance = currentMonth - this.monthOfPurchase;
    return this.initialHomePrice * Math.pow(1 + this.percentAnnualHomeAppreciation / 100, monthsSinceMortgageOrRefinance / 12);
  }

  getCurrentEquity(currentMonth) {
    const monthsIntoAmoSchedule = currentMonth - this.monthOfLatestMortgageOrRefinance;
    const homeValue = this.getCurrentHomeValue(currentMonth);
    const remainingBalance = this.schedule[monthsIntoAmoSchedule].remainingBalance;
    const percentOwnershipOfHome = this.percentDownPayment + ((this.loanAmount - remainingBalance) / this.loanAmount) * 100;
    const currentEquity = percentOwnershipOfHome * homeValue;
    return currentEquity;
  }

  getCurrentRefiCost(currentMonth) {
    return 7000 * Math.pow(1.025, currentMonth / 12);
  }

  /**
   * Calculates refinance potential payout
   * @param {number} percentAnnualHomeAppreciationRate - Annual home appreciation rate as a percentage
   * @param {number} monthsSinceMortgageOrRefinance - Number of months since original mortgage or last refinance
   * @returns {number} payout {number} - The potential cash payout from refinancing (after costs)
   **/
  getPossibleRefinancePayout(currentMonth) {
    if (currentMonth === this.monthOfLatestMortgageOrRefinance) {
      throw new Error("can't get possible refinance details for the month you do a refinance");
    }
    ///// returning 0 if home is not a refinancing home.
    if (this.willReinvest === false) {
      return 0;
    }
    const monthsSinceMortgageOrRefinance = currentMonth - this.monthOfLatestMortgageOrRefinance;
    const currentHomeValue =
      this.initialHomePrice * Math.pow(1 + this.percentAnnualHomeAppreciation / 100, (currentMonth - this.monthOfPurchase) / 12);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipleOnMortgage = this.schedule[monthsSinceMortgageOrRefinance].remainingBalance;
    const payout = grossPayout - remainingPrincipleOnMortgage; // we are working under the assumption that the refinance is done immediately after the mortgage payment for this month

    return payout;
  }

  doARefinance(currentMonth, newInterestRate, newPercentDownPayment, newLoanTermYears) {
    if (newPercentDownPayment < 25) {
      throw new Error("Down payment for refinance cannot be lower than 25 percent.");
    }

    const monthsSinceMortgageOrRefinance = currentMonth - this.monthOfLatestMortgageOrRefinance;

    // Payout information
    const currentHomeValue =
      this.initialHomePrice * Math.pow(1 + this.percentAnnualHomeAppreciation / 100, (currentMonth - this.monthOfPurchase) / 12);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipleOnMortgage = this.schedule[monthsSinceMortgageOrRefinance].remainingBalance;
    const payoutAfterPayingOffCurrentMortgage = grossPayout - remainingPrincipleOnMortgage;

    // New loan info (updating class fields)
    this.monthOfLatestMortgageOrRefinance = currentMonth;
    this.loanAmount = currentHomeValue * 0.75;
    this.loanTermYears = newLoanTermYears;
    this.percentAnnualInterestRate = newInterestRate;
    this.percentDownPayment = newPercentDownPayment;
    this.schedule = this.amoCalc.generateAmortizationSchedule(
      this.loanAmount,
      Number(this.percentAnnualInterestRate),
      Number(this.loanTermYears)
    );
    this.refinanceSchedule.push({ month: currentMonth, amount: payoutAfterPayingOffCurrentMortgage });

    return payoutAfterPayingOffCurrentMortgage;
  }
}

// Currrency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

export default House;
