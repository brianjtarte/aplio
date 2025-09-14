import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    // Temporary hardcoded validation
    if (email === 'test@test.com' && password === 'password') {
      return NextResponse.json({ 
        message: 'Login successful',
        user: { id: '1', email: 'test@test.com', name: 'Test User' }
      });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}