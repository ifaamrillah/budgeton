import { apiGet } from "@/lib/axiosClient";

export async function syncAuth() {
  const res = await apiGet({
    url: "auth/sync",
  });
  return res;
}
