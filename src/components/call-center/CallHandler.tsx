import React, { useState, useEffect } from 'react';
import { useTwilio } from '../../hooks/useTwilio';
import { useAIVoice } from '../../hooks/useAIVoice';
import { useCRM } from '../../hooks/useCRM';

interface CallHandlerProps {
  callerType: 'B2B' | 'B2C';
  onCallEnd: (callData: any) => void;
}

export const CallHandler: React.FC<CallHandlerProps> = ({ callerType, onCallEnd }) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'incoming' | 'outgoing' | 'active'>('idle');
  const [callerInfo, setCallerInfo] = useState<any>(null);
  
  const { initializeCall, endCall, handleIncomingCall } = useTwilio();
  const { processVoiceInput, generateResponse } = useAIVoice();
  const { getCallerData, updateCallerData } = useCRM();

  useEffect(() => {
    // Initialize Twilio connection
    const setupCallHandling = async () => {
      await handleIncomingCall(async (call: any) => {
        setCallStatus('incoming');
        const callerData = await getCallerData(call.from);
        setCallerInfo(callerData);
        
        // Process with AI based on caller type
        const aiResponse = await processVoiceInput(call, callerType);
        if (aiResponse.shouldTransfer) {
          // Transfer to human agent
          await transferToAgent(call, aiResponse.context);
        }
      });
    };

    setupCallHandling();
  }, []);

  const handleOutboundCall = async (phoneNumber: string) => {
    setCallStatus('outgoing');
    const call = await initializeCall(phoneNumber);
    setCallStatus('active');
    
    // Process with AI
    const aiResponse = await processVoiceInput(call, callerType);
    return aiResponse;
  };

  const transferToAgent = async (call: any, context: any) => {
    // Implementation for transferring to human agent
    // This would integrate with your agent routing system
  };

  return (
    <div className="call-handler">
      <div className="call-status">
        Status: {callStatus}
      </div>
      {callerInfo && (
        <div className="caller-info">
          <h3>Caller Information</h3>
          <pre>{JSON.stringify(callerInfo, null, 2)}</pre>
        </div>
      )}
      <div className="call-controls">
        <button 
          onClick={() => endCall()}
          disabled={callStatus === 'idle'}
        >
          End Call
        </button>
      </div>
    </div>
  );
}; 