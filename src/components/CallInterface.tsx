import React, { useEffect, useRef, useState } from 'react';
import { useCallStore } from '@/store';
import WebRTCService from '@/lib/webrtc';
import logger from '@/lib/logger';

interface CallInterfaceProps {
  userId: string;
  remoteUserId: string;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ userId, remoteUserId }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const webrtcRef = useRef<WebRTCService | null>(null);

  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        webrtcRef.current = new WebRTCService({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add your TURN server configuration here
          ],
          socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        });

        await webrtcRef.current.initialize(userId);
      } catch (error) {
        logger.error('Failed to initialize WebRTC:', error);
      }
    };

    initializeWebRTC();

    return () => {
      webrtcRef.current?.disconnect();
    };
  }, [userId]);

  const startCall = async () => {
    try {
      await webrtcRef.current?.startCall(remoteUserId);
      setIsCallActive(true);
    } catch (error) {
      logger.error('Failed to start call:', error);
    }
  };

  const endCall = async () => {
    try {
      await webrtcRef.current?.endCall();
      setIsCallActive(false);
      setTranscription('');
    } catch (error) {
      logger.error('Failed to end call:', error);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {isCallActive ? 'Call in Progress' : 'Ready to Call'}
            </h2>
            <p className="text-gray-600">
              {isCallActive ? 'Connected with ' + remoteUserId : 'Click to start call'}
            </p>
          </div>

          {isCallActive && (
            <div className="w-full bg-gray-100 rounded-lg p-4 min-h-[100px]">
              <p className="text-sm text-gray-600">Live Transcription:</p>
              <p className="mt-2">{transcription || 'Listening...'}</p>
            </div>
          )}

          <div className="flex space-x-4">
            {!isCallActive ? (
              <button
                onClick={startCall}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
              >
                Start Call
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    isMuted
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={endCall}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  End Call
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default CallInterface; 