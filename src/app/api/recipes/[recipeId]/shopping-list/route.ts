import { NextResponse } from "next/server";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";

type RecipeWithIngredients = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
} & {
  ingredients: {
    ingredient: {
      name: string;
    };
  }[];
  category: {
    name: string;
  };
};

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

function getPrompt(recipe: RecipeWithIngredients) {
  return `
La recette "${recipe.name}" est décrite comme suit : "${
    recipe.description
  }". Les ingrédients nécessaires pour cette recette sont :

${recipe.ingredients
  .map((ingredient) => `- ${ingredient.ingredient.name}`)
  .join("\n")}
`;
}

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
                name: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      return new Response(null, { status: 404 });
    }

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Génèrez une liste d'achats détaillée pour la recette fournie. La liste doit inclure tous les ingrédients nécessaires, y compris des ingrédients de base comme sel, poivre, huile, etc., si ces derniers ne sont pas déjà listés. Assurez-vous que la liste d'achats est complète, pratique pour l'utilisateur et formatée en JSON, avec chaque élément représentant un article à acheter. Utilisez le format suivant pour chaque élément de la liste :
          [
            { 'name': 'Nom de l'achat 1' },
            { 'name': 'Nom de l'achat 2' },
            { 'name': 'Nom de l'achat 3' },
            { 'name': 'Nom de l'achat 4' },
          ]`,
        },
        {
          role: "user",
          content: getPrompt(recipe),
        },
      ],
    });

    return NextResponse.json(
      JSON.parse(completions.choices[0].message.content as string)
    );
  });
}

export { GET };
