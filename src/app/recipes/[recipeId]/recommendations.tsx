import Link from "next/link";
import type { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
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
