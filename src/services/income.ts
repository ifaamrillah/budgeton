import { TypeIncomeValidator } from "@/validator/account-validator";
import { apiPost } from "@/lib/axiosClient";

export async function createIncome(data: TypeIncomeValidator) {
  return await apiPost({
    url: "/income",
    data,
  });
}
