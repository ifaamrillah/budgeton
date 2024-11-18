import { TypeAccountValidator } from "@/validator/account-validator";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/axiosClient";

export async function getAllAccount(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/account",
    params,
  });
}

export async function getAccountById(id?: string) {
  return await apiGet({
    url: `/account/${id}`,
  });
}

export async function createAccount(data: TypeAccountValidator) {
  return await apiPost({
    url: "/account",
    data,
  });
}

export async function updateAccountById(
  id: string,
  data: TypeAccountValidator
) {
  return await apiPatch({
    url: `/account/${id}`,
    data,
  });
}

export async function deleteAccountById(id: string) {
  return await apiDelete({
    url: `/account/${id}`,
  });
}
