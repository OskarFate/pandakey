import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // TODO: Implement user authentication with MongoDB
    if (email === 'admin@pandakey.games' && password === 'admin123') {
      const token = 'mock-jwt-token'; // TODO: Generate real JWT
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'admin@pandakey.games',
            role: 'admin',
            name: 'Admin User'
          },
          token
        },
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed'
      },
      { status: 500 }
    );
  }
}