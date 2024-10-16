import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { textStream } = await streamText({
    model: anthropic('claude-3-haiku-20240307'),
    messages,
  });

  return new Response(textStream);
}
