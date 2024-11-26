import { apiPost } from "@/lib/axiosClient";
import { TypeExpenseValidator } from "@/lib/validator";

export async function createExpense(data: TypeExpenseValidator) {
  return await apiPost({
    url: "/expense",
    data,
  });
}
