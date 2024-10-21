import { updateTokenCount } from "@/app/lib/actions";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookie = cookies().get("pb_auth");
  if (!cookie) throw new Error("Not logged in");

  const { messages } = await req.json();

  const { textStream } = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    //model: anthropic('claude-3-opus-20240229'),
    messages,
    onFinish: async ({ usage }) => {
      try {
        await updateTokenCount({ anthropic: usage });
      } catch (error: unknown) {
        console.error("Error updating token count in PocketBase:", error);
      }
    },
  });

  return new Response(textStream);
}
