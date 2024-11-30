import { apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeTransferValidator } from "@/lib/validator";

export async function getAllTransfer(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/transfer",
    params,
  });
}

export async function getTransferById(id?: string) {
  return await apiGet({
    url: `/transfer/${id}`,
  });
}

export async function createTransfer(data: TypeTransferValidator) {
  return await apiPost({
    url: "/transfer",
    data,
  });
}

export async function updateTransferById(
  id: string,
  data: TypeTransferValidator
) {
  return await apiPatch({
    url: `/transfer/${id}`,
    data,
  });
}
