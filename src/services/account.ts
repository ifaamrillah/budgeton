import { z } from "zod";

import { CreateAccountValidator } from "@/validator/account-validator";
import { apiRequest } from "@/lib/api";

export async function createAccount(
  values: z.infer<typeof CreateAccountValidator>
) {
  const res = await apiRequest({
    method: "POST",
    url: "/api/account/create",
    data: values,
  });
  return res;
}

export async function getAllAccount(params?: Record<string, unknown>) {
  const res = await apiRequest({
    method: "GET",
    url: "/api/account",
    params,
  });
  return res;
}
