"use client";

import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { syncAuth } from "@/services/auth-service";

import { Spinner } from "@/components/ui/spinner";

export default function Syncpage() {
  const { isSuccess } = useQuery({
    queryKey: ["sync"],
    queryFn: syncAuth,
  });

  if (isSuccess) redirect("/dashboard");

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Spinner size="large">Sync your account...</Spinner>
    </div>
  );
}
