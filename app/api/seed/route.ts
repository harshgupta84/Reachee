import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-db';

export async function GET() {
  try {
    await seedDatabase();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database seeded successfully',
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 