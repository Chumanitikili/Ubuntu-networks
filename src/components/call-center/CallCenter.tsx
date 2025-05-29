'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Phone, PhoneOff, Mic, MicOff } from '@mui/icons-material';
import { logger } from '@/utils/logger';

interface CallState {
  isActive: boolean;
  isRecording: boolean;
  callerId: string;
  duration: number;
  transcription: string;
}

export const CallCenter: React.FC = () => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isRecording: false,
    callerId: '',
    duration: 0,
    transcription: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState.isActive) {
      timer = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.isActive]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      setError(null);
      const response = await fetch('/api/twilio/voice/start', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start call');
      }

      const data = await response.json();
      setCallState({
        isActive: true,
        isRecording: false,
        callerId: data.callerId,
        duration: 0,
        transcription: '',
      });
    } catch (err) {
      logger.error('Error starting call:', err);
      setError('Failed to start call. Please try again.');
    }
  };

  const handleEndCall = async () => {
    try {
      setError(null);
      const response = await fetch('/api/twilio/voice/end', {
        method: 'POST',
        body: JSON.stringify({ callSid: callState.callerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to end call');
      }

      setCallState({
        isActive: false,
        isRecording: false,
        callerId: '',
        duration: 0,
        transcription: '',
      });
    } catch (err) {
      logger.error('Error ending call:', err);
      setError('Failed to end call. Please try again.');
    }
  };

  const toggleRecording = () => {
    setCallState(prev => ({
      ...prev,
      isRecording: !prev.isRecording
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Call Center
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              {callState.isActive
                ? `Call in progress - ${formatDuration(callState.duration)}`
                : 'No active call'}
            </Typography>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color={callState.isActive ? 'error' : 'primary'}
              startIcon={callState.isActive ? <PhoneOff /> : <Phone />}
              onClick={callState.isActive ? handleEndCall : handleStartCall}
              disabled={callState.isRecording}
              sx={{ mr: 2 }}
            >
              {callState.isActive ? 'End Call' : 'Start Call'}
            </Button>

            {callState.isActive && (
              <Button
                variant="outlined"
                color={callState.isRecording ? 'error' : 'primary'}
                startIcon={callState.isRecording ? <MicOff /> : <Mic />}
                onClick={toggleRecording}
              >
                {callState.isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            )}
          </Grid>

          {callState.isActive && callState.transcription && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Transcription:
                </Typography>
                <Typography variant="body1">
                  {callState.transcription}
                </Typography>
              </Paper>
            </Grid>
          )}

          {callState.isActive && (
            <Grid item xs={12} textAlign="center">
              <CircularProgress size={24} />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}; 