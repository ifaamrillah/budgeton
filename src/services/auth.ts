import { apiRequest } from "@/lib/api";

export async function syncAuth() {
  const res = await apiRequest({
    method: "GET",
    url: "/api/auth/sync",
  });
  return res;
}
