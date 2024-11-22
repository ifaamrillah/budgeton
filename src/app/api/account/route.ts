import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { AccountValidator } from "@/validator/account-validator";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Check Authorization
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Check Synchronization
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Users are not synchronized" },
      { status: 422 }
    );
  }

  // Check Expired Plan
  if (existingUser.expiredPlan && existingUser.plan !== "LIFETIME") {
    const expiredDate = new Date(existingUser.expiredPlan);
    const currentDate = new Date();
    if (expiredDate < currentDate) {
      return NextResponse.json(
        { message: "User plan has expired." },
        { status: 403 }
      );
    }
  }

  const searchParams = req.nextUrl.searchParams;

  // Pagination
  const pageIndex = parseInt(searchParams.get("pagination[pageIndex]") || "1");
  const pageSize = parseInt(searchParams.get("pagination[pageSize]") || "10");

  // Sorting
  const sortBy = searchParams.get("sorting[sortBy]") || undefined;
  const sortDesc = searchParams.get("sorting[sortDesc]") === "true";
  const orderBy = sortBy ? { [sortBy]: sortDesc ? "desc" : "asc" } : undefined;

  // Filters
  const filterName = searchParams.get("filter[name]") || undefined;
  const filterStatus = (() => {
    const status = searchParams.get("filter[status]");
    return status === "true" ? true : status === "false" ? false : undefined;
  })();

  // Get All Account with Filters
  const getAll = await db.account.findMany({
    where: {
      userId: user.id,
      ...(filterName && {
        name: { contains: filterName, mode: "insensitive" },
      }),
      ...(filterStatus !== undefined && {
        status: filterStatus,
      }),
    },
    skip: (pageIndex - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy,
  });

  // Pagination
  const totalData = await db.account.count({
    where: {
      userId: user.id,
      ...(filterName && {
        name: { contains: filterName, mode: "insensitive" },
      }),
      ...(filterStatus !== undefined && {
        status: filterStatus,
      }),
    },
  });
  const totalPage = Math.ceil(totalData / pageSize);

  if (getAll.length > 0) {
    return NextResponse.json(
      {
        message: "Get all account successfully.",
        data: getAll,
        pagination: {
          pageIndex,
          pageSize,
          totalPage,
          totalData,
        },
        sorting: {
          sortBy,
          sortDesc,
        },
      },
      { status: 200 }
    );
  }

  if (getAll.length <= 0) {
    return NextResponse.json(
      {
        message: "No accounts found.",
        data: [],
        pagination: {
          pageIndex,
          pageSize,
          totalPage: 0,
          totalData: 0,
        },
        sorting: {
          sortBy,
          sortDesc,
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      message: "Get all account failed.",
    },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  // Check Authorization
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Check Synchronization
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Users are not synchronized" },
      { status: 422 }
    );
  }

  // Check Expired Plan
  if (existingUser.expiredPlan && existingUser.plan !== "LIFETIME") {
    const expiredDate = new Date(existingUser.expiredPlan);
    const currentDate = new Date();
    if (expiredDate < currentDate) {
      return NextResponse.json(
        { message: "User plan has expired." },
        { status: 403 }
      );
    }
  }

  // Body
  const body = await req.json();
  const validatedFields = AccountValidator.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        message:
          validatedFields?.error?.errors[0]?.message ||
          "Field validation error",
      },
      { status: 400 }
    );
  }

  // Check name is unique
  const checkAccountName = await db.account.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name: body.name,
      },
    },
  });
  if (checkAccountName) {
    return NextResponse.json(
      {
        message: `Account with name: "${body.name}" already exists.`,
      },
      { status: 409 }
    );
  }

  // Create Account
  const create = await db.account.create({
    data: {
      name: body.name,
      status: body.status,
      startingBalance: body.startingBalance,
      userId: user.id,
    },
  });
  if (create) {
    return NextResponse.json(
      {
        message: "Create account successfully.",
        data: create,
      },
      { status: 201 }
    );
  }

  // Internal Server Error
  return NextResponse.json(
    {
      message: "Create account failed.",
    },
    { status: 500 }
  );
}
