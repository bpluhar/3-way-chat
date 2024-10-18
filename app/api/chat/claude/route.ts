import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { cookies } from 'next/headers';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocket.leaselogic.app/');

export const runtime = 'edge';

export async function POST(req: Request) {
  const cookie = cookies().get('pb_auth');
  const userId = JSON.parse(cookie?.value || '{}').model.id;
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error('Not logged in');
  
  const { messages } = await req.json();
  
  const { textStream } = await streamText({
    model: anthropic('claude-3-haiku-20240307'),
    messages,
    onFinish: async ({ usage }) => {
      console.log('Claude result:', usage);
      const tokenCount = usage // if you want to call the usage tokens onCompletion + save stuff etc
      //console.log('Token usage by Google:', JSON.stringify(tokenCount, null, 2));
      try {
        const record = await pb.collection('token_counts').getOne(userId);
        
        if (record.anthropic) {
          const newTokenCount = {
            promptTokens: record.anthropic.promptTokens + tokenCount.promptTokens,
            completionTokens: record.anthropic.completionTokens + tokenCount.completionTokens,
            totalTokens: record.anthropic.totalTokens + tokenCount.totalTokens
          };
          await pb.collection('token_counts').update(userId, {
            anthropic: newTokenCount
          });
        } else {
          const newTokenCount = {
            promptTokens: tokenCount.promptTokens,
            completionTokens: tokenCount.completionTokens,
            totalTokens: tokenCount.totalTokens
          };
          await pb.collection('token_counts').update(userId, {
            anthropic: newTokenCount
          });
        } 
        
      }
      catch (error: unknown) {
        if (error instanceof Error && 'status' in error && error.status === 404) {
          await pb.collection('token_counts').create({
            id: userId,
            anthropic: tokenCount,
            openai: {},
            google: {}
          });
        }
        else {
          console.error('Error updating token count in PocketBase:', error);
        }
      }
    }
  });

  return new Response(textStream);
}
