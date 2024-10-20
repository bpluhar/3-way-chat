import { updateTokenCount } from "@/app/lib/actions";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookie = cookies().get("pb_auth");
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error("Not logged in");

  const { messages } = await req.json();

  const { textStream } = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    //model: anthropic('claude-3-opus-20240229'),
    messages,
    onFinish: async ({ usage }) => {
      //console.log('Claude result:', usage);
      const tokenCount = usage; // if you want to call the usage tokens onCompletion + save stuff etc
      //console.log('Token usage by Google:', JSON.stringify(tokenCount, null, 2));
      try {
        await updateTokenCount({ anthropic: tokenCount });

        // const record = await getTokenCount();

        // if (record && record.anthropic) {
        //   const newTokenCount = {
        //     promptTokens:
        //       record.anthropic.promptTokens + tokenCount.promptTokens,
        //     completionTokens:
        //       record.anthropic.completionTokens + tokenCount.completionTokens,
        //     totalTokens: record.anthropic.totalTokens + tokenCount.totalTokens,
        //   };

        //   await updateTokenCount({ anthropic: newTokenCount });
        // } else {
        //   const newTokenCount = {
        //     promptTokens: tokenCount.promptTokens,
        //     completionTokens: tokenCount.completionTokens,
        //     totalTokens: tokenCount.totalTokens,
        //   };
        //   await updateTokenCount({ anthropic: newTokenCount });
        // }
      } catch (error: unknown) {
        console.error("Error updating token count in PocketBase:", error);
      }
    },
  });

  return new Response(textStream);
}
