import { NextResponse } from "next/server";
import type { Recipe } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { openai } from "@/lib/openai";

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

function getPrompt(recipe: Recipe) {
  return `
Génèrez 4 suggestions d'accompagnements possibles pour cette recette. La recette a pour nom "${recipe.name}" et la description suivante : "${recipe.description}".

Assurez-vous que les accompagnements s'accordent bien avec cette recette spécifique. Utilisez des descriptions détaillées pour fournir des suggestions pertinentes et appétissantes.

Formattez la réponse comme un tableau JSON avec les propriétés suivantes pour chaque accompagnement :
[
  { "name": "Nom de l'accompagnement 1" },
  { "name": "Nom de l'accompagnement 2" },
  { "name": "Nom de l'accompagnement 3" },
  { "name": "Nom de l'accompagnement 4" },
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
