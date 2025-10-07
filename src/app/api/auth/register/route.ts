import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    // TODO: Implement user registration with MongoDB
    const newUser = {
      id: Date.now(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      {
        success: true,
        data: { user: newUser },
        message: 'User registered successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed'
      },
      { status: 500 }
    );
  }
}