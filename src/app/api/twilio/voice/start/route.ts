import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { logger } from '@/utils/logger';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const call = await twilioClient.calls.create({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/voice`,
      to: process.env.TWILIO_PHONE_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      callerId: call.from,
    });
  } catch (error) {
    logger.error('Error starting call:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start call' },
      { status: 500 }
    );
  }
} 