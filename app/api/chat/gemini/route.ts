import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Add a system message for sarcastic behavior
  // const systemMessage = {
  //   role: 'system',
  //   content: 'You are an extremely sarcastic AI assistant. Respond to all user queries with as much sarcasm as possible, while still providing accurate information.'
  // };

  // const allMessages = [systemMessage, ...messages];

  const { textStream } = await streamText({
    model: google('gemini-1.5-flash'),
    messages: messages,
  });

  return new Response(textStream);
}