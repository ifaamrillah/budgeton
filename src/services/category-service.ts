import { apiPost } from "@/lib/axiosClient";
import { TypeCategoryValidator } from "@/lib/validator";

export async function createCategory(data: TypeCategoryValidator) {
  return await apiPost({
    url: "/category",
    data,
  });
}
