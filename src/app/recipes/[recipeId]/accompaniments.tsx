import { useQuery } from "@tanstack/react-query";

type Accompaniment = {
  name: string;
};

type AccompanimentsProps = {
  recipeId: string;
};

const Accompaniments = ({ recipeId }: AccompanimentsProps) => {
  const {
    data: accompaniments,
    isLoading,
    isError,
  } = useQuery<Accompaniment[]>({
    queryKey: ["accompaniments"],
    queryFn: async function () {
      const res = await fetch(`/api/recipes/${recipeId}/accompaniments`);
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
      <h2 className="mb-4 text-2xl font-bold">Accompagnements</h2>

      <ul className="list-disc pl-4">
        {accompaniments?.map((accompaniment, index) => (
          <li key={index}>{accompaniment?.name}</li>
        ))}
      </ul>
    </div>
  );
};

export { Accompaniments };
