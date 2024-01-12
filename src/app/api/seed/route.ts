import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

import { db } from "@/lib/db";

import { categories, ingredients, recipeIngredient, recipes } from "./data";

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

async function POST() {
  try {
    const vectorDb = await mysql.createConnection({
      host: "svc-f1f2615b-b52b-4e67-aede-103161570f7c-dml.aws-frankfurt-1.svc.singlestore.com",
      port: 3306,
      database: "cuisineconnectdb",
      user: "admin",
      password: "8Q62UxZ2W2Nwt1oRrbEa7hEcA1LaqGzH",
    });

    /**
     *
     */

    await vectorDb.execute("DELETE FROM recipies");

    await db.recipeIngredient.deleteMany();
    await db.ingredient.deleteMany();
    await db.recipe.deleteMany();
    await db.category.deleteMany();

    /**
     *
     */

    await db.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    await db.recipe.createMany({
      data: recipes,
      skipDuplicates: true,
    });
    await db.ingredient.createMany({
      data: ingredients,
      skipDuplicates: true,
    });
    await db.recipeIngredient.createMany({
      data: recipeIngredient,
      skipDuplicates: true,
    });

    const allRecipes = await db.recipe.findMany({
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

    for (const recipe of allRecipes) {
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

      await vectorDb.execute(
        "INSERT INTO recipies (id, vector) values (?, JSON_ARRAY_PACK(?))",
        [recipe.id, "[" + data.data[0].embedding.join(", ") + "]"]
      );
    }

    await vectorDb.end();

    return NextResponse.json({
      message: "Database seeded successfully",
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export { POST };
