import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";

import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validator";
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
  const filterName = filters?.name || undefined;
  const filterType = filters?.type || undefined;

  const filterWhereClause = {
    userId: user.id,
    ...(filterName && {
      name: { contains: filterName, mode: "insensitive" },
    }),
    ...(filterType && {
      type: filterType as CategoryType,
    }),
  };

  // Get all category
  const getAllCategory = await db.category.findMany({
    where: filterWhereClause,
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    take: pagination.pageSize,
    orderBy: sorting.orderBy,
  });

  // Pagination response
  const totalData = await db.category.count({
    where: filterWhereClause,
  });
  const totalPage = Math.ceil(totalData / pagination.pageSize);

  return NextResponse.json(
    {
      message: getAllCategory.length
        ? "Get all category successfully."
        : "No categories found",
      data: getAllCategory,
      filters,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalPage: totalPage,
        totalData: totalData,
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
  const validatedFields = CategoryValidator.safeParse(body);
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
  const existingCategoryName = await db.category.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name: body.name,
      },
    },
  });
  if (existingCategoryName) {
    return NextResponse.json(
      { message: `Category with name: "${body.name}" already exists.` },
      { status: 400 }
    );
  }

  // Create category
  const createCategory = await db.category.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  if (createCategory) {
    return NextResponse.json(
      {
        message: "Create category successfully.",
        data: createCategory,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create category failed." },
    { status: 500 }
  );
}
