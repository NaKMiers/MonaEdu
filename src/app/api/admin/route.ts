import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('- Admin -');

  try {
    return new Response('Hello from admin route', { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
