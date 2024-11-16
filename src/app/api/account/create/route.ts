import { currentUser } from "@clerk/nextjs/server";

import { CreateAccountValidator } from "@/validator/account-validator";
import { db } from "@/lib/db";

export async function POST(req: Request) {
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

  const body = await req.json();

  const validatedFields = CreateAccountValidator.safeParse(body);
  if (!validatedFields.success) {
    return Response.json(
      {
        message: "Field validation error",
      },
      { status: 400 }
    );
  }

  const create = await db.account.create({
    data: {
      name: body.name,
      status: body.status,
      startingBalance: body.startingBalance,
      userId: user.id,
    },
  });
  if (create) {
    return Response.json(
      {
        message: "Account successfully created.",
        data: create,
      },
      { status: 201 }
    );
  }

  return Response.json(
    {
      message: `Create account failed.`,
    },
    { status: 500 }
  );
}
