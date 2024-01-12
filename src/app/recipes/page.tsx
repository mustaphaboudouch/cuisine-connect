"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";

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

  if (recipes?.length === 0) {
    return <div className="p-4 text-center">Aucune recette trouvée.</div>;
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          type="search"
          name="search"
          placeholder="Rechercher des recettes..."
          defaultValue={search || ""}
          className="w-full"
        />
        <Button type="submit" className="w-12">
          <SearchIcon className="h-5 w-5 shrink-0" />
        </Button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {recipes?.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-lg border border-gray-300 bg-gray-50 p-4 hover:bg-gray-100"
          >
            <Link href={`/recipes/${recipe.id}`} className="text-sm">
              {recipe.name}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
