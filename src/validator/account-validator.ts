import { z } from "zod";

export const CreateAccountValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  startingBalance: z
    .number({ message: "Starting Balance must be number" })
    .min(0, { message: "Starting Balance must not be minus" }),
  status: z.boolean(),
});
