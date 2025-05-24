import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test the database connection with a simple query
    const usersCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection established successfully',
      usersCount,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to the database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 