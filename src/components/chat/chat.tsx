"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Input } from "@/components/input";

import { Button } from "../button";

type Message = {
  role: "user" | "system";
  content: string;
};

const Chat = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [answer, setAnswer] = React.useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (messages: Message[]) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.body;
    },
    onSuccess: async function (stream) {
      if (!stream) throw new Error("No stream");

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let answerTemp = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setAnswer((prev) => prev + chunkValue);
        answerTemp += chunkValue;
      }

      setMessages((prev) => [...prev, { role: "system", content: answerTemp }]);
      setAnswer("");
    },
    onError: function () {
      console.log("Something went wrong. Please try again.");
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const question = formData.get("question") as string;

    const newMessages = [
      ...messages,
      { role: "user", content: question },
    ] as Message[];

    mutate(newMessages);
    setMessages(newMessages);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("rounded-xl p-4 text-sm font-medium", {
              "ml-10 bg-slate-800 text-white": message.role === "user",
              "mr-10 bg-gray-200": message.role === "system",
            })}
          >
            {message.content}
          </div>
        ))}
        {answer && (
          <div className="mr-10 rounded-xl bg-gray-200 p-4 text-sm font-medium">
            {answer}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex h-20 items-center gap-2 p-4"
      >
        <Input
          ref={inputRef}
          name="question"
          placeholder="Ask your question..."
          className="w-full"
        />
        <Button type="submit" disabled={isPending}>
          Envoyer
        </Button>
      </form>
    </>
  );
};

export { Chat };
