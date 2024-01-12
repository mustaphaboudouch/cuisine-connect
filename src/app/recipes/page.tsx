"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes", search],
    queryFn: async function () {
      const res = await fetch(
        `/api/recipes?search=${encodeURIComponent(search || "")}`
      );
      return res.json();
    },
  });

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const search = formData.get("search") as string;
    router.push(pathname + "?" + createQueryString("search", search));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  if (recipes?.length === 0) {
    return <div>No recipes found.</div>;
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="search"
          name="search"
          className="border border-black"
          defaultValue={search || ""}
        />
        <button type="submit">Search</button>
      </form>

      {recipes?.map((recipe) => (
        <div key={recipe.id}>
          <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
        </div>
      ))}
    </>
  );
};

export default Page;
