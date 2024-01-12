import * as React from "react";
import { useMutation } from "@tanstack/react-query";

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
      <h2>Comments</h2>
      <ul>
        {isPendingDelete && <span>Loading...</span>}
        {comments.map((comment, index) => (
          <li key={index}>
            <p>
              {comment.user.firstname} {comment.user.lastname}:{" "}
              {comment.content}
            </p>
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => onSubmit(e)}>
        <Textarea
          ref={inputRef}
          name="comment"
          placeholder="Enter your comment..."
        />
        <button type="submit" disabled={isPending}>
          Commenter
        </button>
      </form>
    </div>
  );
};

export { Comments };
