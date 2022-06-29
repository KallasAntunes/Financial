import { InputData } from '@/interfaces/calculator_input.interface';
import numberToFixedToNumber from '@/utils/numberToFixedToNumber';
import yearlyToMonthlyInterest from '@/utils/yearlyToMonthlyInterest';

class IndexService {
  public calculate = (data: InputData, usePercentage: boolean, hasPredefinedTime: boolean): { [key: string]: number } => {
    //Defining our variables
    let months: number = 0;
    let totalMoney: number = data.initialValue;
    let monthlyContribution: number = data.monthlyContribution;

    while ((hasPredefinedTime && totalMoney * yearlyToMonthlyInterest(data.profitability) < data.desiredDividends) || months <= data.desiredTime) {
      months++;
      totalMoney = this.increasedTotalAmount(totalMoney, monthlyContribution, data.profitability);
      monthlyContribution = this.increasedMonthlyContribution(months, usePercentage, monthlyContribution, data);
    }

    //Returning the result
    const dividends = numberToFixedToNumber(totalMoney * yearlyToMonthlyInterest(data.profitability));
    return { lastMonthContribution: monthlyContribution, totalMoney: numberToFixedToNumber(totalMoney), dividends, months };
  };

  //Sums the monthly contribution to the total money and then multiplying by the the interest rate
  private increasedTotalAmount = (totalMoney: number, monthlyContribution: number, profitability: number): number => {
    totalMoney *= 1 + yearlyToMonthlyInterest(profitability);
    totalMoney += monthlyContribution;
    return totalMoney;
  };

  private increasedMonthlyContribution = (passedMonths: number, usePercentage: boolean, monthlyContribution: number, data: InputData): number => {
    //Checking if it's time to increase the monthly contribution
    if (passedMonths % data.increaseFrequencyMonths !== 0) return monthlyContribution;
    //Increasing the monthly contribution by either a fixed amount or a percentage
    return usePercentage ? monthlyContribution * (1 + data.increasePercentage) : monthlyContribution + data.increaseTotalAmount;
  };
}

export default IndexService;
