import { NextResponse } from "next/server";
import { z } from "zod";

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
Génèrez une liste d'achats pour préparer cette recette. La recette a pour nom "${
    recipe.name
  }" et la description suivante : "${
    recipe.description
  }". Les ingrédients nécessaires pour cette recette sont les suivants :

${recipe.ingredients
  .map((ingredient) => `- ${ingredient.ingredient.name}`)
  .join("\n")}

Ajoutez également des ingrédients de base tels que sel, poivre, huile, etc., s'ils ne sont pas déjà inclus dans la liste. Assurez-vous que la liste d'achats est complète.
Formattez la réponse comme un tableau des noms des achats.

Exemple de format :
[
  { "name": "Nom de l'achat 1" },
  { "name": "Nom de l'achat 2" },
  { "name": "Nom de l'achat 3" },
  { "name": "Nom de l'achat 4" },
]`;
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
          role: "user",
          content: getPrompt(recipe),
        },
      ],
    });

    return NextResponse.json(
      JSON.parse(completions.choices[0].message.content as string)
    );
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
