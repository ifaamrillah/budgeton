import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return Response.json(
      {
        message:
          "Unauthorized access. Please check your permissions or log in.",
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
    return Response.json(
      {
        message: `User with email: ${user.emailAddresses[0].emailAddress} not found.`,
      },
      { status: 404 }
    );
  }

  const expiredPlan = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); //15 days

  const create = await db.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      expiredPlan,
    },
  });
  if (create) {
    return Response.json(
      {
        message: "User successfully registered.",
        data: create,
      },
      { status: 201 }
    );
  }

  return Response.json(
    {
      message: `Create user failed.`,
    },
    { status: 500 }
  );
}
