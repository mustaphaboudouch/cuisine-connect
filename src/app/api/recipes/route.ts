import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

async function GET(request: Request) {
  try {
    // SELECT id, dot_product(vector, JSON_ARRAY_PACK('[1, 0, 0]')) AS score FROM recipies WHERE score > 0.5 ORDER BY score DESC LIMIT 4;
    // SELECT id, dot_product(vector, JSON_ARRAY_PACK('[1, 0, 0]')) AS score FROM recipies ORDER BY score DESC LIMIT 4;

    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    console.log("search", search);

    const recipes = await db.recipe.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(recipes);
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
