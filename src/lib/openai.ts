import OpenAI from "openai";

/**
 * OpenAI client instance
 */

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Get `recipe` embeddings
 */

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

function getRecipePrompt(recipe: RecipeWithCategoryAndIngredients) {
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

export { openai, getRecipePrompt };
