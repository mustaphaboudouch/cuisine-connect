import { NextResponse } from "next/server";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { connectVectorDatabase } from "@/lib/vectorDb";

type RecipeWithCategory = {
  id: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
};

async function GET(request: Request) {
  return handleAsyncError(async () => {
    const url = new URL(request.url);
    const search = decodeURIComponent(url.searchParams.get("search") || "");

    let recipes: RecipeWithCategory[] = [];

    if (!search) {
      recipes = await db.recipe.findMany({
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
    } else {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input: search,
        }),
      });
      const data = await res.json();

      const vectorDb = await connectVectorDatabase();

      const result = await vectorDb.execute(
        "SELECT id, dot_product(vector, JSON_ARRAY_PACK(?)) AS score FROM recipies WHERE score > 0.73 ORDER BY score DESC",
        ["[" + data.data[0].embedding.join(", ") + "]"]
      );

      await vectorDb.end();

      const ids = (result[0] as { id: string; score: number }[]).map(
        (r) => r.id
      );
      recipes = await db.recipe.findMany({
        where: {
          id: {
            in: ids,
          },
        },
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
    }

    return NextResponse.json(recipes);
  });
}

export { GET };
