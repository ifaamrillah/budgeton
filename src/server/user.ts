import { db } from "@/lib/db";

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    return Response.json(
      {
        message: `User with email: ${email} not found.`,
        error,
      },
      { status: 404 }
    );
  }
}

export async function createUser({
  email,
  externalId,
  expiredPlan,
}: {
  email: string;
  externalId: string;
  expiredPlan: Date;
}) {
  try {
    const create = await db.user.create({
      data: {
        email,
        externalId,
        expiredPlan,
      },
    });

    return create;
  } catch (error) {
    return Response.json(
      {
        message: `Create user failed.`,
        error,
      },
      { status: 500 }
    );
  }
}
