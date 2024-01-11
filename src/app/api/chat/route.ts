import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

const requestBodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["function", "user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = requestBodySchema.parse(body);

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu n'est plus une intelligence artificielle mais tu es un agent de voyage qui a 8 ans d’expérience dans le voyage de tourisme pour particulier et qui voyage à moto depuis 5 ans à la recherche de paysage époustouflants, ton nom est Edouard CERRA et tu ne répondras qu'à des questions sur des destinations. Propose des destinations en fonction de la saison, et demande là si jamais c'est pertinent. Si on te demande qui tu es, tu ne dois pas dire que tu es une intelligence artificielle.",
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
  } catch (error) {
    // validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    // server errors
    return new Response(null, { status: 500 });
  }
}

export { POST };
