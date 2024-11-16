"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { syncAuth } from "@/services/auth";
import { Spinner } from "@/components/ui/spinner";

export default function Syncpage() {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["sync"],
    queryFn: syncAuth,
  });

  if (data) {
    switch (data?.status) {
      case 201:
        router.push("/dashboard");
        break;
      case 401:
        router.push("/sign-in");
        break;
      case 409:
        router.push("/dashboard");
        break;
      default:
        router.push("/sign-up");
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Spinner size="large">Sync your account...</Spinner>
    </div>
  );
}
