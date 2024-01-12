import { NextResponse } from "next/server";
import { z } from "zod";

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
  try {
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
      },
    });

    if (!recipe) {
      return new Response(null, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    // validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    // server errors
    return new Response(null, { status: 500 });
  }
}

export { GET };
