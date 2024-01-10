import React from "react";

import { IconButton } from "../button";

const SearchInput = () => {
  return (
    <div className="flex items-center gap-4">
      <form className="flex w-full items-center">
        <input
          type="search"
          placeholder="Search for recipes"
          className="h-12 flex-1 rounded-xl bg-primary-50 pl-4 pr-16 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2"
        />
        <IconButton type="submit" icon="search" className="-ml-12" />
      </form>
      <IconButton icon="mic" className="h-16 w-16 rounded-full" />
    </div>
  );
};

export { SearchInput };
