import twilio from 'twilio';
import axios from 'axios';

const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.VITE_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export interface CallResponse {
  success: boolean;
  message: string;
  callSid?: string;
}

export const twilioService = {
  async makeCall(to: string): Promise<CallResponse> {
    try {
      const call = await client.calls.create({
        to,
        from: twilioNumber,
        url: `${process.env.VITE_API_URL}/voice-response`, // This will be your TwiML endpoint
      });

      return {
        success: true,
        message: 'Call initiated successfully',
        callSid: call.sid,
      };
    } catch (error) {
      console.error('Error making call:', error);
      return {
        success: false,
        message: 'Failed to initiate call',
      };
    }
  },

  async sendSMS(to: string, message: string): Promise<CallResponse> {
    try {
      const sms = await client.messages.create({
        to,
        from: twilioNumber,
        body: message,
      });

      return {
        success: true,
        message: 'SMS sent successfully',
        callSid: sms.sid,
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        message: 'Failed to send SMS',
      };
    }
  },
}; 