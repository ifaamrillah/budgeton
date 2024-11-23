import { Account } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface CalculateAccountBalancesProps extends Account {
  incomes: { amount: Decimal }[];
}

export function calculateAccountBalances(
  accounts: CalculateAccountBalancesProps[]
) {
  return accounts.map((account) => {
    const totalIncome = account.incomes.reduce((acc, income) => {
      const incomeAmount = new Decimal(income.amount);
      return acc.plus(incomeAmount);
    }, new Decimal(0));

    const balance = new Decimal(account.startingBalance).plus(totalIncome);

    return {
      ...account,
      balance,
    };
  });
}
