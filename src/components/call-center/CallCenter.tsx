import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneDisabled as PhoneDisabledIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Headset as HeadsetIcon,
  HeadsetOff as HeadsetOffIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}));

const CallButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  width: 64,
  height: 64,
  minWidth: 64,
  padding: 0,
  '&.active': {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '20',
  },
}));

export const CallCenter: React.FC = () => {
  const theme = useTheme();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeadsetOn, setIsHeadsetOn] = useState(true);
  const [callType, setCallType] = useState<'B2B' | 'B2C'>('B2B');

  const handleCallToggle = () => {
    setIsCallActive(!isCallActive);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleHeadsetToggle = () => {
    setIsHeadsetOn(!isHeadsetOn);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Call Center
      </Typography>

      <Grid container spacing={3}>
        {/* Active Call Panel */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Chip
                  icon={callType === 'B2B' ? <BusinessIcon /> : <PersonIcon />}
                  label={callType}
                  color={callType === 'B2B' ? 'primary' : 'secondary'}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6">Active Call</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    bgcolor: callType === 'B2B' ? 'primary.main' : 'secondary.main',
                  }}
                >
                  {callType === 'B2B' ? <BusinessIcon sx={{ fontSize: 60 }} /> : <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>

                <Typography variant="h5" sx={{ mb: 1 }}>
                  {callType === 'B2B' ? 'Acme Corporation' : 'John Smith'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {callType === 'B2B' ? '+1 (555) 123-4567' : '+1 (555) 987-6543'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <ControlButton
                    onClick={handleMuteToggle}
                    color={isMuted ? 'error' : 'default'}
                  >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                  </ControlButton>
                  <CallButton
                    variant="contained"
                    color={isCallActive ? 'error' : 'primary'}
                    onClick={handleCallToggle}
                    className={isCallActive ? 'active' : ''}
                  >
                    {isCallActive ? <PhoneDisabledIcon /> : <PhoneIcon />}
                  </CallButton>
                  <ControlButton
                    onClick={handleHeadsetToggle}
                    color={!isHeadsetOn ? 'error' : 'default'}
                  >
                    {isHeadsetOn ? <HeadsetIcon /> : <HeadsetOffIcon />}
                  </ControlButton>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Call notes..."
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Call Queue */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Call Queue
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  {
                    type: 'B2B',
                    name: 'TechStart Inc.',
                    phone: '+1 (555) 111-2222',
                    waitTime: '2 min',
                  },
                  {
                    type: 'B2C',
                    name: 'Sarah Johnson',
                    phone: '+1 (555) 333-4444',
                    waitTime: '1 min',
                  },
                  {
                    type: 'B2B',
                    name: 'Global Corp',
                    phone: '+1 (555) 555-6666',
                    waitTime: '3 min',
                  },
                ].map((call, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '20',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: call.type === 'B2B' ? 'primary.main' : 'secondary.main',
                        mr: 2,
                      }}
                    >
                      {call.type === 'B2B' ? <BusinessIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{call.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {call.phone}
                      </Typography>
                    </Box>
                    <Chip
                      label={call.waitTime}
                      size="small"
                      color={call.type === 'B2B' ? 'primary' : 'secondary'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}; 