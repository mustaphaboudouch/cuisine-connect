import { NextResponse } from "next/server";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";

const requestBodySchema = z.object({
  comment: z.string(),
});

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

async function POST(
  request: Request,
  context: z.infer<typeof routeContextSchema>
) {
  return handleAsyncError(async () => {
    const body = await request.json();
    const { params } = routeContextSchema.parse(context);
    const { comment: text } = requestBodySchema.parse(body);

    const comment = await db.comment.create({
      data: {
        content: text,
        user: {
          connect: {
            id: "cjklsdjfsl1",
          },
        },
        recipe: {
          connect: {
            id: params.recipeId,
          },
        },
      },
    });

    return NextResponse.json(comment);
  });
}

export { POST };
