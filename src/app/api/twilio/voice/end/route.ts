import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { logger } from '@/utils/logger';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const { callSid } = await req.json();

    if (!callSid) {
      return NextResponse.json(
        { success: false, error: 'Call SID is required' },
        { status: 400 }
      );
    }

    await twilioClient.calls(callSid).update({ status: 'completed' });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error ending call:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to end call' },
      { status: 500 }
    );
  }
} 