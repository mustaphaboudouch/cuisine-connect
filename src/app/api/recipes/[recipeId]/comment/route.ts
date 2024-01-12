import { NextResponse } from "next/server";
import { z } from "zod";

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
  try {
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
  } catch (error) {
    // validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    // server errors
    return new Response(null, { status: 500 });
  }
}

export { POST };
