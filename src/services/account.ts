import { TypeAccountValidator } from "@/validator/account-validator";
import { apiGet, apiPatch, apiPost } from "@/lib/axiosClient";

export async function getAllAccount(params?: Record<string, unknown>) {
  const res = await apiGet({
    url: "/account",
    params,
  });
  return res;
}

export async function getAccountById(id?: string) {
  const res = await apiGet({
    url: `/account/${id}`,
  });
  return res;
}

export async function createAccount(data: TypeAccountValidator) {
  const res = await apiPost({
    url: "/account",
    data,
  });
  return res;
}

export async function updateAccountById(
  id: string,
  data: TypeAccountValidator
) {
  const res = await apiPatch({
    url: `/account/${id}`,
    data,
  });
  return res;
}
