import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { handleAsyncError } from "@/lib/async-error";
import { signJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { signInSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return handleAsyncError(async () => {
    const json = await req.json();
    const body = signInSchema.parse(json);

    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const token = await signJWT({
      payload: { sub: user.id },
      options: { exp: `${process.env.JWT_EXPIRES_IN}m` },
    });

    cookies().set({
      name: process.env.JWT_TOKEN_NAME!,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: Number(process.env.JWT_EXPIRES_IN) * 60,
    });

    return NextResponse.json({ token }, { status: 200 });
  });
}
