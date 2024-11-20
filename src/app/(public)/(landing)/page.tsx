import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return <main>hallo</main>;
}
