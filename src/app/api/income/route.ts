import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { IncomeValidator } from "@/lib/validator";
import { parseQueryParams } from "@/lib/utils";

import { authorizeAndValidateUser } from "@/server/auth-server";

export async function GET(req: NextRequest) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;
  const { user } = authResult;

  // Query params
  const { pagination, sorting, filters } = parseQueryParams(
    req.nextUrl.searchParams
  );

  // Get all income
  const getAllIncome = await db.income.findMany({
    where: {
      userId: user.id,
    },
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    take: pagination.pageSize,
    orderBy: sorting.orderBy,
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Pagination response
  const totalData = await db.income.count({
    where: {
      userId: user.id,
    },
  });
  const totalPage = Math.ceil(totalData / pagination.pageSize);

  return NextResponse.json(
    {
      message: getAllIncome?.length
        ? "Get all income successfully."
        : "No incomes found.",
      data: getAllIncome,
      filters,
      pagination: {
        ...pagination,
        totalPage,
        totalData,
      },
      sorting,
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;
  const { user } = authResult;

  // Body
  const body = await req.json();
  if (body.date) body.date = new Date(body.date);

  // Field validation
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

  const transformFields = () => {
    const { account, ...newData } = validatedFields.data;

    return {
      ...newData,
      accountId: account.value,
      userId: user.id,
    };
  };

  // Create income
  const create = await db.income.create({
    data: {
      ...transformFields(),
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

  // Internal server error
  return NextResponse.json(
    { message: "Create income failed." },
    { status: 500 }
  );
}
