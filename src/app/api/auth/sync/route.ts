import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { FREE_PLAN_DURATION } from "@/lib/constants";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized access.",
      },
      { status: 401 }
    );
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });
  if (existingUser) {
    return NextResponse.json(
      {
        message: "User already synchronized.",
      },
      { status: 200 }
    );
  }

  const expiredPlan = new Date(Date.now() + FREE_PLAN_DURATION); //15 days

  const create = await db.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      expiredPlan,
    },
  });
  if (create) {
    return NextResponse.json(
      {
        message: "User successfully synchronized.",
        data: create,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      message: "User synchronization failed.",
    },
    { status: 500 }
  );
}
