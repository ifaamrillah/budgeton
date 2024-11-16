import { currentUser } from "@clerk/nextjs/server";

import { createUser, getUserByEmail } from "@/server/user";

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

  const existingUser = await getUserByEmail({
    email: user.emailAddresses[0].emailAddress,
  });
  if (existingUser) {
    return Response.json(
      {
        message: "This user is already registered. Please log in instead.",
      },
      { status: 409 }
    );
  }

  const expiredPlan = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); //15 days

  const create = await createUser({
    email: user.emailAddresses[0].emailAddress,
    externalId: user.id,
    expiredPlan,
  });
  if (create) {
    return Response.json(
      {
        message: "Account successfully registered.",
      },
      { status: 201 }
    );
  }
}
