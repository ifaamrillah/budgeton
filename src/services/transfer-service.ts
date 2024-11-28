import { apiGet, apiPost } from "@/lib/axiosClient";
import { TypeTransferValidator } from "@/lib/validator";

export async function getAllTransfer(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/transfer",
    params,
  });
}

export async function createTransfer(data: TypeTransferValidator) {
  return await apiPost({
    url: "/transfer",
    data,
  });
}
