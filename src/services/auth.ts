import { apiGet } from "@/lib/axiosClient";

export async function syncAuth() {
  return await apiGet({
    url: "auth/sync",
  });
}
