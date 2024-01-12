import * as React from "react";
import type { User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/button";
import { Textarea } from "@/components/input";
import { queryClient } from "@/components/query-provider";

type CommentsProps = {
  recipeId: string;
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      firstname: string;
      lastname: string;
    };
  }[];
};

const Comments = ({ recipeId, comments }: CommentsProps) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async function () {
      const res = await fetch("/api/user");
      return res.json();
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (comment: string) => {
      const response = await fetch(`/api/recipes/${recipeId}/comment`, {
        method: "POST",
        body: JSON.stringify({ comment }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      return response.body;
    },
    onSuccess: async function () {
      await queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      console.log("Comment sent successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  const { mutate: deleteComment, isPending: isPendingDelete } = useMutation({
    mutationFn: async (commenId: string) => {
      const response = await fetch(`/api/comments/${commenId}`, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      return response.body;
    },
    onSuccess: async function () {
      await queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      console.log("Comment deleted successfully.");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const comment = formData.get("comment") as string;

    mutate(comment);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Comments</h2>

      <ul className="mb-4 flex flex-col gap-4">
        {comments.map((comment, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg bg-gray-100 p-4 text-sm"
          >
            <p>
              <span className="font-bold">
                {comment.user.firstname} {comment.user.lastname}
              </span>{" "}
              : {comment.content}
            </p>
            {user?.id === comment.user.id && (
              <button
                onClick={() => deleteComment(comment.id)}
                disabled={isPendingDelete}
              >
                <Trash2Icon className="h-5 w-5 text-red-500" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col items-start gap-2"
      >
        <Textarea
          ref={inputRef}
          name="comment"
          placeholder="Enter your comment..."
        />
        <Button type="submit" disabled={isPending}>
          Commenter
        </Button>
      </form>
    </div>
  );
};

export { Comments };
