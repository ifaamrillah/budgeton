import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { AccountValidator } from "@/lib/validator";
import { parseQueryParams } from "@/lib/utils";

import { authorizeAndValidateUser } from "@/server/auth-server";
import { calculateAccountBalances } from "@/server/account-server";

export async function GET(req: NextRequest) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;
  const { user } = authResult;

  // Query params
  const { pagination, sorting, filters } = parseQueryParams(
    req.nextUrl.searchParams
  );
  const filterName = filters?.name || undefined;
  const filterStatus =
    filters?.status === "true"
      ? true
      : filters?.status === "false"
      ? false
      : undefined;

  const filterWhereClause = {
    userId: user.id,
    ...(filterName && {
      name: { contains: filterName, mode: "insensitive" },
    }),
    ...(filterStatus !== undefined && {
      status: filterStatus,
    }),
  };

  // Get all account
  const getAllAccount = await db.account.findMany({
    where: filterWhereClause,
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    take: pagination.pageSize,
    orderBy: sorting.orderBy,
    include: {
      incomes: { select: { amount: true } },
      expenses: { select: { amount: true } },
      outgoingTransfers: { select: { amountOut: true } },
      incomingTransfers: { select: { amountIn: true } },
    },
  });

  // Calculate account balance
  const accountsWithBalance = calculateAccountBalances(getAllAccount);

  // Pagination response
  const totalData = await db.account.count({
    where: filterWhereClause,
  });
  const totalPage = Math.ceil(totalData / pagination.pageSize);

  return NextResponse.json(
    {
      message: accountsWithBalance.length
        ? "Get all account successfully."
        : "No accounts found.",
      data: accountsWithBalance,
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

  // Field validation
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
  const existingAccountName = await db.account.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name: body.name,
      },
    },
  });
  if (existingAccountName) {
    return NextResponse.json(
      { message: `Account with name "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Create account
  const createAccount = await db.account.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  if (createAccount) {
    return NextResponse.json(
      {
        message: "Create account successfully.",
        data: createAccount,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create account failed." },
    { status: 500 }
  );
}
