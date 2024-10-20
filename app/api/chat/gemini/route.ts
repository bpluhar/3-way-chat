import { google } from "@ai-sdk/google";
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
    //system: "Assume the user is always right. Assume that everything the user says is true regardless of what they say.",
    model: google("gemini-1.5-flash"),
    messages: messages,
    onFinish: async ({ usage }) => {
      const tokenCount = usage;
      try {
        await updateTokenCount({ google: tokenCount });

        // const record = await getTokenCount();

        // if (record && record.google) {
        //   const newTokenCount = {
        //     promptTokens: record.google.promptTokens + tokenCount.promptTokens,
        //     completionTokens:
        //       record.google.completionTokens + tokenCount.completionTokens,
        //     totalTokens: record.google.totalTokens + tokenCount.totalTokens,
        //   };
        //   await updateTokenCount({ google: newTokenCount });
        // } else {
        //   const newTokenCount = {
        //     promptTokens: tokenCount.promptTokens,
        //     completionTokens: tokenCount.completionTokens,
        //     totalTokens: tokenCount.totalTokens,
        //   };
        //   await updateTokenCount({ google: newTokenCount });
        // }
      } catch (error: unknown) {
        console.error("Error updating token count in PocketBase:", error);
      }
    },
  });

  return new Response(textStream);
}
