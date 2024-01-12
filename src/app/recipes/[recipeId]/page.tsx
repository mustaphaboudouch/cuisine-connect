"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { Accompaniments } from "./accompaniments";
import { Comments } from "./comments";
import { Recommendations } from "./recommendations";
import { ShoppingList } from "./shopping-list";

type PageProps = {
  params: {
    recipeId: string;
  };
};

type RecipeWithIngredients = {
  id: string;
  name: string;
  description: string;
} & {
  category: {
    name: string;
  };
  ingredients: {
    ingredient: {
      name: string;
      allergen: string | null;
    };
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      firstname: string;
      lastname: string;
    };
  }[];
};

const Page = ({ params: { recipeId } }: PageProps) => {
  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery<RecipeWithIngredients>({
    queryKey: ["recipe", recipeId],
    queryFn: async function () {
      const res = await fetch(`/api/recipes/${recipeId}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div>
        <LoaderIcon className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full border border-red-600 bg-red-50 p-4 text-sm font-medium">
        Something went wrong. Please reload the page.
      </div>
    );
  }

  return (
    <>
      <ul>
        <li className="mb-2 text-3xl font-bold">{recipe?.name}</li>
        <li className="inline-flex rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
          {recipe?.category.name}
        </li>
        <li className="mt-2">{recipe?.description}</li>
      </ul>

      <br />
      <Recommendations recipeId={recipeId} />
      <br />
      <Accompaniments recipeId={recipeId} />
      <br />
      <ShoppingList recipeId={recipeId} />
      <br />
      <Comments recipeId={recipeId} comments={recipe?.comments || []} />
    </>
  );
};

export default Page;
