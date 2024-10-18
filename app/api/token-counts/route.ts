import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cookie = cookies().get('pb_auth');
  const userId = JSON.parse(cookie?.value || '{}').model.id;
  
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error('Not logged in');
  
  const pb = new PocketBase('https://pocket.leaselogic.app/');

  try {
    const data = await pb.collection('token_counts').getOne(userId);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);

    await pb.collection('token_counts').create({
      id: userId,
      openai: {"completionTokens": 0, "promptTokens": 0, "totalTokens": 0},
      anthropic: {"completionTokens": 0, "promptTokens": 0, "totalTokens": 0},
      google: {"completionTokens": 0, "promptTokens": 0, "totalTokens": 0}
    });

    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
