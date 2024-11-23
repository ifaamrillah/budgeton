import { Account } from "@prisma/client";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeAccountValidator } from "@/lib/validator";

export async function getAllAccount(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/account",
    params,
  });
}

export async function getAccountOptions(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/account",
    params,
  }).then((data) => {
    if (data?.data) {
      const transformedData = data?.data?.map((item: Account) => ({
        value: item.id,
        label: item.name,
      }));
      return transformedData;
    }
    return data;
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
