import { NextResponse } from "next/server";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
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
  return handleAsyncError(async () => {
    const { params } = routeContextSchema.parse(context);

    await db.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return NextResponse.json(null);
  });
}

export { DELETE };
