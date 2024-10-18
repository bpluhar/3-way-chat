import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocket.leaselogic.app/');

export const runtime = 'edge';


export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const { textStream } = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    onFinish: async ({ usage }) => {
      const tokenCount = usage // if you want to call the usage tokens onCompletion + save stuff etc
      //console.log('Token usage by Google:', JSON.stringify(tokenCount, null, 2));
      try {
        const record = await pb.collection('token_counts').getOne('1234567890abcde');
        
        if (record.openai) {
          const newTokenCount = {
            promptTokens: record.openai.promptTokens + tokenCount.promptTokens,
            completionTokens: record.openai.completionTokens + tokenCount.completionTokens,
            totalTokens: record.openai.totalTokens + tokenCount.totalTokens
          };
          await pb.collection('token_counts').update('1234567890abcde', {
            openai: newTokenCount
          });
        } else {
          const newTokenCount = {
            promptTokens: tokenCount.promptTokens,
            completionTokens: tokenCount.completionTokens,
            totalTokens: tokenCount.totalTokens
          };
          await pb.collection('token_counts').update('1234567890abcde', {
            openai: newTokenCount
          });
        } 
        
      }
      catch (error: unknown) {
        if (error instanceof Error && 'status' in error && error.status === 404) {
          await pb.collection('token_counts').create({
            id: '1234567890abcde',
            openai: tokenCount,
            anthropic: {},
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
