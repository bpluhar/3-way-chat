import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const pb = new PocketBase('https://pocket.leaselogic.app/');

  try {
    const data = await pb.collection('token_counts').getOne('1234567890abcde');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
