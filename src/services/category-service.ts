import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeCategoryValidator } from "@/lib/validator";
import { Category } from "@prisma/client";

export async function getAllCategory(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/category",
    params,
  });
}

export async function getCategoryOptions(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/category",
    params,
  }).then((data) => {
    if (data?.data) {
      const transformedData = data?.data?.map((item: Category) => ({
        value: item.id,
        label: item.name,
      }));
      return transformedData;
    }
    return data;
  });
}

export async function getCategoryById(id?: string) {
  return await apiGet({
    url: `/category/${id}`,
  });
}

export async function createCategory(data: TypeCategoryValidator) {
  return await apiPost({
    url: "/category",
    data,
  });
}

export async function updateCategoryById(
  id: string,
  data: TypeCategoryValidator
) {
  return await apiPatch({
    url: `/category/${id}`,
    data,
  });
}

export async function deleteCategoryById(id: string) {
  return await apiDelete({
    url: `/category/${id}`,
  });
}
