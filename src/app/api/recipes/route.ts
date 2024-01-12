import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { z } from "zod";

import { db } from "@/lib/db";

type RecipeWithCategory = {
  id: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
};

async function GET(request: Request) {
  try {
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

      const vectorDb = await mysql.createConnection({
        host: "svc-f1f2615b-b52b-4e67-aede-103161570f7c-dml.aws-frankfurt-1.svc.singlestore.com",
        port: 3306,
        database: "cuisineconnectdb",
        user: "admin",
        password: "8Q62UxZ2W2Nwt1oRrbEa7hEcA1LaqGzH",
      });

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
