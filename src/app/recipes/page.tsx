"use client";

import Link from "next/link";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async function () {
      const res = await fetch("/api/recipes?search=search-test");
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
      {recipes?.map((recipe) => (
        <div key={recipe.id}>
          <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
        </div>
      ))}
    </>
  );
};

export default Page;
