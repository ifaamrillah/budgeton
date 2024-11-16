import { apiRequest } from "@/lib/api";

export async function syncAuth() {
  const res = await apiRequest("GET", "/api/auth/sync");
  return res;
}
