import { useState, useEffect } from 'react';
import { Device } from 'twilio-client';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  applicationSid: string;
}

export const useTwilio = (config?: TwilioConfig) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (config) {
      initializeDevice(config);
    }
  }, [config]);

  const initializeDevice = async (config: TwilioConfig) => {
    try {
      const newDevice = new Device(config.accountSid, {
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
      });

      await newDevice.register();
      setDevice(newDevice);
      setIsReady(true);

      // Set up event listeners
      newDevice.on('incoming', handleIncomingCall);
      newDevice.on('disconnect', handleDisconnect);
      newDevice.on('error', handleError);
    } catch (error) {
      console.error('Error initializing Twilio device:', error);
      setIsReady(false);
    }
  };

  const handleIncomingCall = (call: any) => {
    setActiveCall(call);
    // Additional incoming call handling logic
  };

  const handleDisconnect = () => {
    setActiveCall(null);
  };

  const handleError = (error: any) => {
    console.error('Twilio device error:', error);
  };

  const initializeCall = async (phoneNumber: string) => {
    if (!device || !isReady) {
      throw new Error('Twilio device not initialized');
    }

    try {
      const call = await device.connect({
        params: {
          To: phoneNumber,
          CallerId: device.capabilities?.outgoing?.applicationSid,
        },
      });

      setActiveCall(call);
      return call;
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  };

  const endCall = async () => {
    if (activeCall) {
      try {
        await activeCall.disconnect();
        setActiveCall(null);
      } catch (error) {
        console.error('Error ending call:', error);
        throw error;
      }
    }
  };

  const handleIncomingCall = (callback: (call: any) => void) => {
    if (!device) return;

    device.on('incoming', (call: any) => {
      callback(call);
    });
  };

  return {
    device,
    activeCall,
    isReady,
    initializeCall,
    endCall,
    handleIncomingCall,
  };
}; 