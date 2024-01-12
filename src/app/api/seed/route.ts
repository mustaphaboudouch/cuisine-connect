import { NextResponse } from "next/server";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { getRecipePrompt } from "@/lib/openai";
import { connectVectorDatabase } from "@/lib/vectorDb";

import {
  categories,
  ingredients,
  recipeIngredient,
  recipes,
  users,
} from "./data";

async function POST() {
  return handleAsyncError(async () => {
    const vectorDb = await connectVectorDatabase();

    /**
     * Clear all tables
     */

    await vectorDb.execute("DELETE FROM recipies");

    await db.comment.deleteMany();
    await db.recipeIngredient.deleteMany();
    await db.ingredient.deleteMany();
    await db.recipe.deleteMany();
    await db.category.deleteMany();
    await db.user.deleteMany();

    /**
     * Seed the database
     */

    await db.user.createMany({
      data: users,
      skipDuplicates: true,
    });
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

    /**
     * Seed the vector database
     */

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

      await vectorDb.execute(
        "INSERT INTO recipies (id, vector) values (?, JSON_ARRAY_PACK(?))",
        [recipe.id, "[" + data.data[0].embedding.join(", ") + "]"]
      );
    }

    await vectorDb.end();

    return NextResponse.json({
      message: "Database seeded successfully",
    });
  });
}

export { POST };
