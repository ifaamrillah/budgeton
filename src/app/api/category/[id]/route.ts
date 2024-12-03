import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validator";

import { authorizeAndValidateUser } from "@/server/auth-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;

  // Params
  const id = (await params).id;

  // Get category by id
  const getCategoryById = await db.category.findUnique({
    where: {
      id,
    },
  });
  if (!getCategoryById) {
    return NextResponse.json(
      { message: `Category with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get category with id: "${id}" successfully.`,
      data: getCategoryById,
    },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authorization
  const authResult = await authorizeAndValidateUser();
  if ("status" in authResult) return authResult;
  const { user } = authResult;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getCategoryById = await db.category.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getCategoryById) {
    return NextResponse.json(
      { message: `Category with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

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
    select: {
      id: true,
      name: true,
    },
  });
  if (existingCategoryName && existingCategoryName.id !== id) {
    return NextResponse.json(
      { message: `Category name "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Update category by id
  const updateCategoryById = await db.category.update({
    where: {
      id,
    },
    data: validatedFields.data,
  });
  if (updateCategoryById) {
    return NextResponse.json(
      {
        message: "Edit category successfully.",
        data: updateCategoryById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Edit category failed." },
    { status: 500 }
  );
}
