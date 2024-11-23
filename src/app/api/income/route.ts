import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { IncomeValidator } from "@/validator/account-validator";
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

  // Get All Income with Filters
  const getAll = await db.income.findMany({
    where: {
      userId: user.id,
    },
    skip: (pageIndex - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy,
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Pagination
  const totalData = await db.income.count({
    where: {
      userId: user.id,
    },
  });
  const totalPage = Math.ceil(totalData / pageSize);

  if (getAll.length > 0) {
    return NextResponse.json(
      {
        message: "Get all income successfully.",
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
        message: "No incomes found.",
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
      message: "Get all income failed.",
    },
    { status: 500 }
  );
}

export async function POST(req: NextRequest) {
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
  if (body.date) body.date = new Date(body.date);
  const validatedFields = IncomeValidator.safeParse(body);
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

  // Create Income
  const create = await db.income.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  if (create) {
    return NextResponse.json(
      {
        message: "Create income successfully.",
        data: create,
      },
      { status: 201 }
    );
  }

  // Internal Server Error
  return NextResponse.json(
    {
      message: "Create income failed.",
    },
    { status: 500 }
  );
}
