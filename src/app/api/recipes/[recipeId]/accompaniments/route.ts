import { NextResponse } from "next/server";
import type { Recipe } from "@prisma/client";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

function getPrompt(recipe: Recipe) {
  return `
Génèrez 4 suggestions d'accompagnements possibles pour la recette nommée "${recipe.name}", qui est décrite comme suit : "${recipe.description}". `;
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
    });

    if (!recipe) {
      return new Response(null, { status: 404 });
    }

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Vous êtes un modèle AI spécialisé en suggestions culinaires. Fournissez des recommandations d'accompagnements qui s'accordent avec la recette spécifiée, en suivant le format JSON précis. Chaque suggestion doit inclure un nom, comme indiqué ci-dessous :
          Prenez en compte les éléments suivants lors de la formulation des suggestions :
            - Accord parfait avec les saveurs et ingrédients de la recette
            - Adaptation aux éventuelles restrictions alimentaires ou préférences (ex. végétarien, sans gluten)
            - Présentation de suggestions créatives et appétissantes

          Formattez la réponse en respectant le format JSON suivant, en détaillant chaque accompagnement :
          [
            { "name": "Nom de l'accompagnement 1" },
            { "name": "Nom de l'accompagnement 2" },
            { "name": "Nom de l'accompagnement 3" },
            { "name": "Nom de l'accompagnement 4" },
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
