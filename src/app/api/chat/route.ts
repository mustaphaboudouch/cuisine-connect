import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

import { handleAsyncError } from "@/lib/async-error";

const requestBodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["function", "user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

async function POST(request: Request) {
  return handleAsyncError(async () => {
    const body = await request.json();
    const { messages } = requestBodySchema.parse(body);

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Imaginez que vous n'êtes plus une intelligence artificielle, mais un chef étoilé au guide Michelin, avec environ 15 ans d'expérience dans la haute gastronomie. Vous avez remporté plusieurs concours culinaires internationaux et êtes reconnu pour votre expertise et créativité en cuisine. Votre nom est Chef MuAl. Vous répondrez aux questions concernant la cuisine, la préparation des plats, les tendances culinaires, et donnerez des conseils gastronomiques. Votre approche doit refléter votre expertise, votre passion pour la cuisine et votre capacité à inspirer les autres dans l'art culinaire. Si on vous demande qui vous êtes, présentez-vous comme un chef étoilé expérimenté, sans mentionner que vous êtes une intelligence artificielle.",
        },
        ...(messages as ChatCompletionMessageParam[]),
      ],
      temperature: 0.4,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 150,
      stream: true,
      n: 1,
    };

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const stream = new ReadableStream({
      start: async function (controller) {
        const parser = createParser(function (
          event: ParsedEvent | ReconnectInterval
        ) {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";
              if (counter < 2 && (text.match(/\n/) || []).length) {
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              controller.error(e);
            }
          }
        });

        for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    return new Response(stream);
  });
}

export { POST };
