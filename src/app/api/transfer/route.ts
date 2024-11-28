import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { TransferValidator } from "@/lib/validator";
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

  // Get all transfer
  const getAllTransfer = await db.transfer.findMany({
    where: {
      userId: user.id,
    },
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    take: pagination.pageSize,
    orderBy: sorting.orderBy,
    include: {
      fromAccount: {
        select: {
          id: true,
          name: true,
        },
      },
      toAccount: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Pagination response
  const totalData = await db.transfer.count({
    where: {
      userId: user.id,
    },
  });
  const totalPage = Math.ceil(totalData / pagination.pageSize);

  return NextResponse.json(
    {
      message: getAllTransfer?.length
        ? "Get all transfer successfully."
        : "No transfers found.",
      data: getAllTransfer,
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
  const validatedFields = TransferValidator.safeParse(body);
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
    const { fromAccount, toAccount, ...newData } = validatedFields.data;

    return {
      ...newData,
      fromAccountId: fromAccount.value,
      toAccountId: toAccount.value,
      userId: user.id,
    };
  };

  // Create transfer
  const createTransfer = await db.transfer.create({
    data: transformFields(),
  });
  if (createTransfer) {
    return NextResponse.json(
      {
        message: "Create transfer successfully.",
        data: createTransfer,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create transfer failed." },
    { status: 500 }
  );
}
