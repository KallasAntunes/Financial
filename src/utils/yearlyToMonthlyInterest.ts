const yearlyToMonthlyInterest = (profitability: number) => (1 + profitability) ** (1 / 12) - 1;

export default yearlyToMonthlyInterest;
