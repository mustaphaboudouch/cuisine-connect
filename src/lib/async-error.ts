import { z } from "zod";

type AsyncCallback = () => Promise<Response>;

export async function handleAsyncError(
  callback: AsyncCallback
): Promise<Response> {
  try {
    return callback();
  } catch (error) {
    // validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(JSON.stringify(error.issues)), {
        status: 422,
      });
    }
    // server errors
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
