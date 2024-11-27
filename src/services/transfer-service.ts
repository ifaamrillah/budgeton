import { apiPost } from "@/lib/axiosClient";
import { TypeTransferValidator } from "@/lib/validator";

export async function createTransfer(data: TypeTransferValidator) {
  return await apiPost({
    url: "/transfer",
    data,
  });
}
