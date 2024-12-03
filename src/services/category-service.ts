import { apiGet, apiPost } from "@/lib/axiosClient";
import { TypeCategoryValidator } from "@/lib/validator";

export async function getAllCategory(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/category",
    params,
  });
}

export async function createCategory(data: TypeCategoryValidator) {
  return await apiPost({
    url: "/category",
    data,
  });
}
