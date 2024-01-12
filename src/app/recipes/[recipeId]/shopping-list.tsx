import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

type ShoppingListItem = {
  name: string;
};

type ShoppingListProps = {
  recipeId: string;
};

const ShoppingList = ({ recipeId }: ShoppingListProps) => {
  const {
    data: shoppingList,
    isLoading,
    isError,
  } = useQuery<ShoppingListItem[]>({
    queryKey: ["shopping-list"],
    queryFn: async function () {
      const res = await fetch(`/api/recipes/${recipeId}/shopping-list`);
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
      <h2 className="mb-4 text-2xl font-bold">Liste d achats</h2>

      <ul className="list-disc pl-4">
        {shoppingList?.map((item, index) => <li key={index}>{item.name}</li>)}
      </ul>
    </div>
  );
};

export { ShoppingList };
