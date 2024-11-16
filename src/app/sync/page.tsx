"use client";

import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { syncAuth } from "@/services/auth";
import { Spinner } from "@/components/ui/spinner";

export default function Syncpage() {
  const { data } = useQuery({
    queryKey: ["sync"],
    queryFn: syncAuth,
  });

  if (data) {
    switch (data?.status) {
      case 201:
        redirect("/dashboard");
      case 401:
        redirect("/sign-in");
      case 409:
        redirect("/dashboard");
      default:
        redirect("/sign-up");
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Spinner size="large">Sync your account...</Spinner>
    </div>
  );
}
