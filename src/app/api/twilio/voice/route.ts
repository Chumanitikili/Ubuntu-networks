import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import aiReceptionist from '@/lib/ai-receptionist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const callerId = formData.get('From') as string;
    const speechResult = formData.get('SpeechResult') as string;

    if (!callSid || !callerId) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Process the call with AI receptionist
    const analysis = await aiReceptionist.enhancedCallRouter(
      { callSid, callerId },
      speechResult
    );

    // Generate TwiML response
    const twiml = new twilio.twiml.VoiceResponse();

    if (analysis.routingDecision.priority === 'high') {
      // For high priority calls, connect to an agent immediately
      twiml.say(
        `Thank you for calling. I understand this is important. Please hold while I connect you to an agent. Estimated wait time is ${analysis.routingDecision.estimatedWaitTime} minutes.`
      );
      twiml.enqueue('support')
        .task(JSON.stringify({
          priority: 'high',
          department: analysis.routingDecision.department,
          agentType: analysis.routingDecision.agentType,
          suggestions: analysis.suggestions,
        }));
    } else {
      // For other calls, offer self-service options
      const gather = twiml.gather({
        input: 'speech',
        action: '/api/twilio/voice/handle-input',
        method: 'POST',
        speechTimeout: 'auto',
      });

      gather.say(
        `I understand you're calling about ${analysis.intent.intent}. ` +
        `Would you like to: 1) Speak with an agent, 2) Get automated assistance, or 3) Leave a message?`
      );

      // If no input is received, repeat the options
      twiml.redirect('/api/twilio/voice/route');
    }

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('We apologize, but we encountered an error. Please try your call again later.');
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
} 