"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";

type Message = {
  role: "user" | "system";
  content: string;
};

const Page = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
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
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <span className="font-bold underline">{message.role}</span> :{" "}
            {message.content}
          </li>
        ))}
        {answer && (
          <li>
            <span className="font-bold underline">system</span> : {answer}
          </li>
        )}
      </ul>

      <form onSubmit={(e) => onSubmit(e)}>
        <textarea
          ref={inputRef}
          name="question"
          placeholder="Ask your question..."
          className="border border-black"
        />
        <button type="submit">
          Send {isPending && <span>(Loading...)</span>}
        </button>
      </form>
    </>
  );
};

export default Page;