import { z } from "zod";

import { CreateAccountValidator } from "@/validator/account-validator";
import { apiRequest } from "@/lib/api";

export async function createAccount(
  values: z.infer<typeof CreateAccountValidator>
) {
  const res = await apiRequest("POST", "/api/account/create", values);
  return res;
}
