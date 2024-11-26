import { apiDelete, apiGet, apiPost } from "@/lib/axiosClient";
import { TypeExpenseValidator } from "@/lib/validator";

export async function getAllExpense(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/expense",
    params,
  });
}

export async function createExpense(data: TypeExpenseValidator) {
  return await apiPost({
    url: "/expense",
    data,
  });
}

export async function deleteExpenseById(id: string) {
  return await apiDelete({
    url: `/expense/${id}`,
  });
}
