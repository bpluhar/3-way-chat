import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocket.leaselogic.app/');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const { textStream } = await streamText({
    model: anthropic('claude-3-haiku-20240307'),
    messages,
    onFinish: async (result: any) => {
      const tokenCount = result.usage // if you want to call the usage tokens onCompletion + save stuff etc
      //console.log('Token usage by Google:', JSON.stringify(tokenCount, null, 2));
      try {
        const record = await pb.collection('token_counts').getOne('1234567890abcde');
        
        if (record.anthropic) {
          const newTokenCount = {
            promptTokens: record.anthropic.promptTokens + tokenCount.promptTokens,
            completionTokens: record.anthropic.completionTokens + tokenCount.completionTokens,
            totalTokens: record.anthropic.totalTokens + tokenCount.totalTokens
          };
          await pb.collection('token_counts').update('1234567890abcde', {
            anthropic: newTokenCount
          });
        } else {
          const newTokenCount = {
            promptTokens: tokenCount.promptTokens,
            completionTokens: tokenCount.completionTokens,
            totalTokens: tokenCount.totalTokens
          };
          await pb.collection('token_counts').update('1234567890abcde', {
            anthropic: newTokenCount
          });
        } 
        
      }
      catch (error: unknown) {
        if (error instanceof Error && 'status' in error && error.status === 404) {
          await pb.collection('token_counts').create({
            id: '1234567890abcde',
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
