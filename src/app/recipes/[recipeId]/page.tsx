"use client";

import { useQuery } from "@tanstack/react-query";

import { Accompaniments } from "./accompaniments";
import { Comments } from "./comments";
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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <>
      <ul>
        <li>Name: {recipe?.name}</li>
        <li>Category: {recipe?.category.name}</li>
        <li>Description: {recipe?.description}</li>
      </ul>

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
