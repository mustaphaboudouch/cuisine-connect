import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";

async function GET() {
  return handleAsyncError(async () => {
    const userId = headers().get("X-USER-ID");
    const user = await db.user.findUnique({
      where: {
        id: userId || "",
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        allergens: true,
      },
    });

    if (!user) {
      return new Response("Unauthorized", { status: 403 });
    }

    return NextResponse.json(user, { status: 200 });
  });
}

export { GET };
