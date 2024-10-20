import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { cookies } from "next/headers";
import { updateTokenCount } from "@/app/lib/actions";

export async function POST(req: Request) {
  const cookie = cookies().get("pb_auth");
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error("Not logged in");

  const { messages } = await req.json();

  const { textStream } = await streamText({
    //system: "Only reply with the letter 'A' regardless of the user's message.",
    model: openai("gpt-4o-mini"),
    messages,
    onFinish: async ({ usage }) => {
      const tokenCount = usage;
      try {

        await updateTokenCount({ openai: tokenCount });


        // const record = await getTokenCount();
        // //console.log(record);
        // if (record && record.openai) {
        //   const newTokenCount = {
        //     promptTokens: record.openai.promptTokens + tokenCount.promptTokens,
        //     completionTokens: record.openai.completionTokens + tokenCount.completionTokens,
        //     totalTokens: record.openai.totalTokens + tokenCount.totalTokens,
        //   };
        //   await updateTokenCount({ openai: newTokenCount });
        // } else {
        //   const newTokenCount = {
        //     promptTokens: tokenCount.promptTokens,
        //     completionTokens: tokenCount.completionTokens,
        //     totalTokens: tokenCount.totalTokens,
        //   };
        //   await updateTokenCount({ openai: newTokenCount });
        // }

      } catch (error: unknown) {
        console.error("Error updating token count in PocketBase:", error);
      }
    },
  });
  return new Response(textStream);
}
