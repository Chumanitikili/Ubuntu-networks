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

    if (!callSid || !callerId || !speechResult) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Process the user's choice
    const choice = speechResult.toLowerCase();
    const twiml = new twilio.twiml.VoiceResponse();

    if (choice.includes('agent') || choice.includes('1')) {
      // Connect to an agent
      const analysis = await aiReceptionist.enhancedCallRouter(
        { callSid, callerId },
        speechResult
      );

      twiml.say(
        `Thank you. I'll connect you to an agent. Estimated wait time is ${analysis.routingDecision.estimatedWaitTime} minutes.`
      );
      twiml.enqueue('support')
        .task(JSON.stringify({
          priority: analysis.routingDecision.priority,
          department: analysis.routingDecision.department,
          agentType: analysis.routingDecision.agentType,
          suggestions: analysis.suggestions,
        }));
    } else if (choice.includes('automated') || choice.includes('2')) {
      // Provide automated assistance
      const analysis = await aiReceptionist.enhancedCallRouter(
        { callSid, callerId },
        speechResult
      );

      // Generate automated response based on intent
      const response = await generateAutomatedResponse(analysis);
      twiml.say(response);

      // Ask if the response was helpful
      const gather = twiml.gather({
        input: 'speech',
        action: '/api/twilio/voice/feedback',
        method: 'POST',
        speechTimeout: 'auto',
      });

      gather.say('Was this information helpful? Please say yes or no.');
    } else if (choice.includes('message') || choice.includes('3')) {
      // Record a message
      twiml.say('Please leave your message after the tone.');
      twiml.record({
        action: '/api/twilio/voice/save-message',
        method: 'POST',
        maxLength: 120,
        playBeep: true,
      });
    } else {
      // Unrecognized input
      twiml.say("I'm sorry, I didn't understand that. Please try again.");
      twiml.redirect('/api/twilio/voice/route');
    }

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Twilio input handler error:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('We apologize, but we encountered an error. Please try your call again later.');
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

async function generateAutomatedResponse(analysis: any): Promise<string> {
  // Generate a response based on the intent and sentiment
  const intent = analysis.intent.intent;
  const sentiment = analysis.sentiment.label;

  const responses: Record<string, string> = {
    billing: 'For billing inquiries, you can check your balance and make payments through our website or mobile app. Would you like me to guide you through the process?',
    technical: 'I can help you with technical issues. Could you please describe the problem you're experiencing in more detail?',
    sales: 'Thank you for your interest in our products. I can provide information about our current offerings and promotions. What specific product are you interested in?',
    complaint: 'I understand you have a concern. Please let me know more about the issue, and I'll do my best to help you resolve it.',
    general: 'How can I assist you today? Please provide more details about what you need help with.',
  };

  return responses[intent] || responses.general;
} 