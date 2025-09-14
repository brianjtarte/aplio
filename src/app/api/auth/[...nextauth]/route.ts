// import { NextRequest } from 'next/server';

// export async function GET(request: NextRequest) {
//   const NextAuth = (await import('next-auth')).default;
//   const { authOptions } = await import('@/lib/auth');
  
//   const handler = NextAuth(authOptions);
//   return handler.handlers.GET(request);
// }

// export async function POST(request: NextRequest) {
//   const NextAuth = (await import('next-auth')).default;
//   const { authOptions } = await import('@/lib/auth');
  
//   const handler = NextAuth(authOptions);
//   return handler.handlers.POST(request);
// }
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'NextAuth GET endpoint working' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'NextAuth POST endpoint working' });
}