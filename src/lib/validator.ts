import { z } from "zod";

export const AccountValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  startingBalance: z
    .number({ message: "Starting Balance must be a number" })
    .min(0, { message: "Starting Balance must not be minus" }),
  status: z.boolean(),
});

export type TypeAccountValidator = z.infer<typeof AccountValidator>;

export const IncomeValidator = z.object({
  date: z.date({ message: "Date is required" }),
  description: z.string().optional(),
  amount: z
    .number({ message: "Amount must be a number" })
    .min(0, { message: "Amount must not be minus" }),
  account: z.object({
    value: z.string({ message: "Account is required" }),
    label: z.string({ message: "Account is required" }),
  }),
});

export type TypeIncomeValidator = z.infer<typeof IncomeValidator>;

export const ExpenseValidator = z.object({
  date: z.date({ message: "Date is required" }),
  description: z.string().optional(),
  amount: z
    .number({ message: "Amount must be a number" })
    .min(0, { message: "Amount must not be minus" }),
  account: z.object({
    value: z.string({ message: "Account is required" }),
    label: z.string({ message: "Account is required" }),
  }),
});

export type TypeExpenseValidator = z.infer<typeof ExpenseValidator>;

export const TransferValidator = z
  .object({
    date: z.date({ message: "Date is required" }),
    description: z.string().optional(),
    amountOut: z
      .number({ message: "Amount Out must be a number" })
      .min(0, { message: "Amount Out must not be minus" }),
    amountIn: z
      .number({ message: "Amount In must be a number" })
      .min(0, { message: "Amount In must not be minus" }),
    fromAccount: z.object({
      value: z.string({ message: "From Account is required" }),
      label: z.string({ message: "From Account is required" }),
    }),
    toAccount: z.object({
      value: z.string({ message: "To Account is required" }),
      label: z.string({ message: "To Account is required" }),
    }),
    fee: z
      .number({ message: "Amount In must be a number" })
      .min(0, { message: "Amount In must not be minus" }),
  })
  .refine((data) => data.amountOut >= data.amountIn, {
    message: "Amount In cannot be greater than Amount Out",
    path: ["amountIn"],
  });

export type TypeTransferValidator = z.infer<typeof TransferValidator>;

export const CategoryValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  type: z.enum(["INCOME", "EXPENSE"]).default("INCOME"),
});

export type TypeCategoryValidator = z.infer<typeof CategoryValidator>;
