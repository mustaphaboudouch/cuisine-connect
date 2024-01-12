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
      <h2>Recommendations</h2>
      <ul>
        {recommendations?.map((recommendation, index) => (
          <li key={index}>
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
