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
  accountId: z.string({ message: "Account is required" }),
});

export type TypeIncomeValidator = z.infer<typeof IncomeValidator>;
