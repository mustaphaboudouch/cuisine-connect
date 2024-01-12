import Link from "next/link";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

type RecommendationsProps = {
  recipeId: string;
};

const Recommendations = ({ recipeId }: RecommendationsProps) => {
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ["recommendations"],
    queryFn: async function () {
      const res = await fetch(`/api/recipes/${recipeId}/recommendations`);
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
    <div>
      <h2 className="mb-4 text-2xl font-bold">Recommendations</h2>

      <ul className="list-disc pl-4">
        {recommendations?.map((recommendation, index) => (
          <li key={index} className="hover:underline">
            <Link href={`/recipes/${recommendation.id}`}>
              {recommendation?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Recommendations };
