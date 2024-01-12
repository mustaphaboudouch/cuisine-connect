import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validation";

export async function PATCH(req: Request) {
  return handleAsyncError(async () => {
    const json = await req.json();
    const body = updateProfileSchema.parse(json);

    const userId = headers().get("X-USER-ID");
    const user = await db.user.update({
      where: {
        id: userId!,
      },
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        allergens: body.allergens,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  });
}
