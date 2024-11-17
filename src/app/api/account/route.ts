import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
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

  const url = new URL(req.url);
  const pageIndex = parseInt(
    url.searchParams.get("pagination[pageIndex]") || "1"
  );
  const pageSize = parseInt(
    url.searchParams.get("pagination[pageSize]") || "10"
  );
  const sortBy = url.searchParams.get("sorting[sortBy]") || undefined;
  const sortDesc = url.searchParams.get("sorting[sortDesc]") === "true";

  const orderBy = sortBy ? { [sortBy]: sortDesc ? "desc" : "asc" } : undefined;

  const getAll = await db.account.findMany({
    where: {
      userId: user.id,
    },
    skip: (pageIndex - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy,
    select: {
      id: true,
      name: true,
      startingBalance: true,
      status: true,
    },
  });

  const totalData = await db.account.count({
    where: {
      userId: user.id,
    },
  });

  const totalPage = Math.ceil(totalData / pageSize);

  if (getAll.length > 0) {
    return Response.json(
      {
        message: "Get All Account Successfully.",
        data: getAll,
        pagination: {
          pageIndex,
          pageSize,
          totalPage,
          totalData,
        },
        sorter: {
          sortBy,
          sortDesc,
        },
      },
      { status: 200 }
    );
  }

  if (getAll.length <= 0) {
    return Response.json(
      {
        message: "No accounts found.",
        data: [],
        pagination: {
          pageIndex,
          pageSize,
          totalPage: 0,
          totalData: 0,
        },
        sorter: {
          sortBy,
          sortDesc,
        },
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
