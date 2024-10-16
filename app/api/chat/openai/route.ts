import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { textStream } = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  return new Response(textStream);
}
