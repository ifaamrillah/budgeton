import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { AccountValidator } from "@/validator/account-validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Params
  const id = (await params).id;

  // Get Account By Id
  const getById = await db.account.findUnique({
    where: {
      id,
    },
  });
  if (!getById) {
    return NextResponse.json(
      {
        message: `Account with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get account with id: "${id}" successfully.`,
      data: getById,
    },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Params
  const id = (await params).id;

  // Check id is valid
  const getById = await db.account.findUnique({
    where: { id },
  });
  if (!getById) {
    return NextResponse.json(
      {
        message: `Account with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
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
  if (checkAccountName?.id !== id) {
    return NextResponse.json(
      {
        message: `Account with name: "${body.name}" already exists.`,
      },
      { status: 409 }
    );
  }

  // Update Account
  const update = await db.account.update({
    where: {
      id,
    },
    data: {
      name: body.name,
      status: body.status,
      startingBalance: body.startingBalance,
    },
  });
  if (update) {
    return NextResponse.json(
      {
        message: "Edit account successfully.",
        data: update,
      },
      { status: 200 }
    );
  }

  // Internal Server Error
  return NextResponse.json(
    {
      message: "Edit account failed.",
    },
    { status: 500 }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Params
  const id = (await params).id;

  // Check id is valid
  const getById = await db.account.findUnique({
    where: { id },
  });
  if (!getById) {
    return NextResponse.json(
      {
        message: `Account with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  // Delate Account
  const deleteAccount = await db.account.delete({
    where: {
      id,
    },
  });
  if (deleteAccount) {
    return NextResponse.json(
      {
        message: "delete account successfully.",
        data: deleteAccount,
      },
      { status: 200 }
    );
  }

  // Internal Server Error
  return NextResponse.json(
    {
      message: "Edit account failed.",
    },
    { status: 500 }
  );
}
