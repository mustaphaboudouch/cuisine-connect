import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

const routeContextSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

async function DELETE(
  request: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    await db.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return NextResponse.json(null);
  } catch (error) {
    // validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    // server errors
    return new Response(null, { status: 500 });
  }
}

export { DELETE };
