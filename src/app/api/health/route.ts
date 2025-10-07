import { NextResponse } from 'next/server';

// GET /api/health - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: '🐼 PandaKey Games API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
}