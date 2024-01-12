import { NextResponse } from "next/server";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { getRecipePrompt } from "@/lib/openai";
import { connectVectorDatabase } from "@/lib/vectorDb";

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
      select: {
        id: true,
        name: true,
        description: true,
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true,
                allergen: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!recipe) {
      return new Response(null, { status: 404 });
    }

    const text = getRecipePrompt(recipe);
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: text,
      }),
    });
    const data = await res.json();

    const vectorDb = await connectVectorDatabase();

    const result = await vectorDb.execute(
      "SELECT id, dot_product(vector, JSON_ARRAY_PACK(?)) AS score FROM recipies WHERE score <> 1 ORDER BY score DESC LIMIT 4",
      ["[" + data.data[0].embedding.join(", ") + "]"]
    );

    await vectorDb.end();

    const ids = (result[0] as { id: string; score: number }[]).map((r) => r.id);
    const recommendations = await db.recipe.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(recommendations);
  });
}

export { GET };
