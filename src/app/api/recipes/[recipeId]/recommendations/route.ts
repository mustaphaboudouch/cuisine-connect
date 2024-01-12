import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { z } from "zod";

import { db } from "@/lib/db";

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

type RecipeWithCategoryAndIngredients = {
  id: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
  ingredients: {
    ingredient: {
      name: string;
      allergen: string | null;
    };
  }[];
};

function convertRecipeToText(recipe: RecipeWithCategoryAndIngredients) {
  return `
Nom: ${recipe.name}
Description: ${recipe.description}
Catégorie: ${recipe.category.name}
Ingrédients:
${recipe.ingredients.map(
  (ingredient) =>
    `- Nom : ${ingredient.ingredient.name}, Allergène : ${
      ingredient.ingredient.allergen
        ? ingredient.ingredient.allergen
        : "Pas d'allergène"
    }\n`
)}
`;
}

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

    const text = convertRecipeToText(recipe);
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

    const vectorDb = await mysql.createConnection({
      host: "svc-f1f2615b-b52b-4e67-aede-103161570f7c-dml.aws-frankfurt-1.svc.singlestore.com",
      port: 3306,
      database: "cuisineconnectdb",
      user: "admin",
      password: "8Q62UxZ2W2Nwt1oRrbEa7hEcA1LaqGzH",
    });

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
