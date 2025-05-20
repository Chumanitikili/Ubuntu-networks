import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { twilioService } from '../services/twilioService';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AIReceptionist: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleCall = async () => {
    if (!phoneNumber) {
      setStatus('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await twilioService.makeCall(phoneNumber);
      setStatus(response.message);
    } catch (error) {
      setStatus('Error making call');
    } finally {
      setLoading(false);
    }
  };

  const handleSMS = async () => {
    if (!phoneNumber || !message) {
      setStatus('Please enter both phone number and message');
      return;
    }

    setLoading(true);
    try {
      const response = await twilioService.sendSMS(phoneNumber, message);
      setStatus(response.message);
    } catch (error) {
      setStatus('Error sending SMS');
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <Typography>Browser doesn't support speech recognition.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        AI Receptionist
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          margin="normal"
          placeholder="+1234567890"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          variant="outlined"
          onClick={toggleListening}
          sx={{ mt: 1 }}
          color={listening ? 'error' : 'primary'}
        >
          {listening ? 'Stop Recording' : 'Start Voice Input'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCall}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Make Call'}
        </Button>
        <Button
          variant="contained"
          onClick={handleSMS}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Send SMS'}
        </Button>
      </Box>

      {status && (
        <Typography
          sx={{ mt: 2, color: status.includes('Error') ? 'error.main' : 'success.main' }}
        >
          {status}
        </Typography>
      )}
    </Paper>
  );
};

export default AIReceptionist; 