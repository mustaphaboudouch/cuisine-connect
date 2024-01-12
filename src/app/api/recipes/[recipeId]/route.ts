import { NextResponse } from "next/server";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

async function GET(
  request: Request,
  context: z.infer<typeof routeContextSchema>
) {
  return handleAsyncError(async () => {
    const { params } = routeContextSchema.parse(context);

    const recipe = await db.recipe.findUnique({
      where: {
        id: params.recipeId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        ingredients: {
          select: {
            ingredient: {
              select: {
                id: true,
                name: true,
                allergen: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!recipe) {
      return new Response(null, { status: 404 });
    }

    return NextResponse.json(recipe);
  });
}

export { GET };
