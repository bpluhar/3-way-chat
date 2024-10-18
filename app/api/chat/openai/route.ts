import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { cookies } from 'next/headers';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocket.leaselogic.app/');

export async function POST(req: Request) {
  const cookie = cookies().get('pb_auth');
  const userId = JSON.parse(cookie?.value || '{}').model.id;
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error('Not logged in');

  const { messages } = await req.json();
  
  const { textStream } = await streamText({
    system: "Only reply with the word 'hello' regardless of the user's message.",
    model: openai('gpt-4o-mini'),
    messages,
    onFinish: async ({ usage }) => {
      const tokenCount = usage // if you want to call the usage tokens onCompletion + save stuff etc
      //console.log('Token usage by Google:', JSON.stringify(tokenCount, null, 2));
      try {
        const record = await pb.collection('token_counts').getOne(userId);
        
        if (record.openai) {
          const newTokenCount = {
            promptTokens: record.openai.promptTokens + tokenCount.promptTokens,
            completionTokens: record.openai.completionTokens + tokenCount.completionTokens,
            totalTokens: record.openai.totalTokens + tokenCount.totalTokens
          };
          await pb.collection('token_counts').update(userId, {
            openai: newTokenCount
          });
        } else {
          const newTokenCount = {
            promptTokens: tokenCount.promptTokens,
            completionTokens: tokenCount.completionTokens,
            totalTokens: tokenCount.totalTokens
          };
          await pb.collection('token_counts').update(userId, {
            openai: newTokenCount
          });
        } 
        
      }
      catch (error: unknown) {
        
          console.error('Error updating token count in PocketBase:', error);
        
      }
    }
  });
  return new Response(textStream);
}
