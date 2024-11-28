import { Account } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface CalculateAccountBalancesProps extends Account {
  incomes: { amount: Decimal }[];
  expenses: { amount: Decimal }[];
  outgoingTransfers: { amountOut: Decimal }[];
  incomingTransfers: { amountIn: Decimal }[];
}

export function calculateAccountBalances(
  accounts: CalculateAccountBalancesProps[]
) {
  return accounts.map((account) => {
    const totalIncome = account.incomes.reduce((acc, income) => {
      const incomeAmount = new Decimal(income.amount);
      return acc.plus(incomeAmount);
    }, new Decimal(0));

    const totalExpense = account.expenses.reduce((acc, expense) => {
      const expenseAmount = new Decimal(expense.amount);
      return acc.plus(expenseAmount);
    }, new Decimal(0));

    const totalOutgoingTransfer = account.outgoingTransfers.reduce(
      (acc, transfer) => {
        const amountOut = new Decimal(transfer.amountOut);
        return acc.plus(amountOut);
      },
      new Decimal(0)
    );

    const totalIncomingTransfer = account.incomingTransfers.reduce(
      (acc, transfer) => {
        const amountIn = new Decimal(transfer.amountIn);
        return acc.plus(amountIn);
      },
      new Decimal(0)
    );

    const balance = new Decimal(account.startingBalance)
      .plus(totalIncome)
      .minus(totalExpense)
      .minus(totalOutgoingTransfer)
      .plus(totalIncomingTransfer);

    return {
      ...account,
      balance,
    };
  });
}

export function calculateAccountBalance(
  account: CalculateAccountBalancesProps
) {
  const totalIncome = account.incomes.reduce((acc, income) => {
    const incomeAmount = new Decimal(income.amount);
    return acc.plus(incomeAmount);
  }, new Decimal(0));

  const totalExpense = account.expenses.reduce((acc, expense) => {
    const expenseAmount = new Decimal(expense.amount);
    return acc.plus(expenseAmount);
  }, new Decimal(0));

  const totalOutgoingTransfer = account.outgoingTransfers.reduce(
    (acc, transfer) => {
      const amountOut = new Decimal(transfer.amountOut);
      return acc.plus(amountOut);
    },
    new Decimal(0)
  );

  const totalIncomingTransfer = account.incomingTransfers.reduce(
    (acc, transfer) => {
      const amountIn = new Decimal(transfer.amountIn);
      return acc.plus(amountIn);
    },
    new Decimal(0)
  );

  const balance = new Decimal(account.startingBalance)
    .plus(totalIncome)
    .minus(totalExpense)
    .minus(totalOutgoingTransfer)
    .plus(totalIncomingTransfer);

  return {
    ...account,
    balance,
  };
}
