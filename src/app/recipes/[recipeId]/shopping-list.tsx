import { useQuery } from "@tanstack/react-query";

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <h2>Shopping List</h2>
      <ul>
        {shoppingList?.map((item, index) => <li key={index}>{item.name}</li>)}
      </ul>
    </div>
  );
};

export { ShoppingList };
