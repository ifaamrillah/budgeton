import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

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

  const getAll = await db.account.findMany({
    where: {
      userId: user.id,
    },
  });
  if (getAll) {
    return Response.json(
      {
        message: "Get All Account Successfully.",
        data: getAll,
      },
      { status: 200 }
    );
  }

  return Response.json(
    {
      message: "Get All Account Failed.",
    },
    { status: 500 }
  );
}
