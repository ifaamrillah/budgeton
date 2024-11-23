import { apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeIncomeValidator } from "@/lib/validator";

export async function getAllIncome(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/income",
    params,
  });
}

export async function getIncomeById(id?: string) {
  return await apiGet({
    url: `/income/${id}`,
  });
}

export async function createIncome(data: TypeIncomeValidator) {
  return await apiPost({
    url: "/income",
    data,
  });
}

export async function updateIncomeById(id: string, data: TypeIncomeValidator) {
  return await apiPatch({
    url: `/income/${id}`,
    data,
  });
}
