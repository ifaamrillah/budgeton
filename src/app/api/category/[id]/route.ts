import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

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
