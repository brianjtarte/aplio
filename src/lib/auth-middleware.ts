import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    return {
      userId: payload.userId as string,
      email: payload.email as string
    };
  } catch (error) {
    return null;
  }
}