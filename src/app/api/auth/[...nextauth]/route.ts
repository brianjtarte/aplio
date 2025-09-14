import NextAuth from 'next-auth';

export const GET = async (req: any, res: any) => {
  const { authOptions } = await import('@/lib/auth');
  return NextAuth(authOptions).handlers.GET(req, res);
};

export const POST = async (req: any, res: any) => {
  const { authOptions } = await import('@/lib/auth');
  return NextAuth(authOptions).handlers.POST(req, res);
};