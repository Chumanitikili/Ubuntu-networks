import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ragService from '@/lib/rag';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { question } = await req.json();
    if (!question) {
      return NextResponse.json(
        { message: 'Question is required' },
        { status: 400 }
      );
    }

    const response = await ragService.query(question);

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Chat API error:', error);
    return NextResponse.json(
      { message: 'Failed to process question' },
      { status: 500 }
    );
  }
} 