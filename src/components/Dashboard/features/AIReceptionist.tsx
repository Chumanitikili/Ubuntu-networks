import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  RecordVoiceOver as VoiceIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const AIReceptionist = () => {
  const [activeCall, setActiveCall] = useState(false);
  const [callHistory, setCallHistory] = useState([
    {
      id: 1,
      caller: '+1 (555) 123-4567',
      duration: '2:30',
      status: 'Completed',
      type: 'Inbound',
      date: '2024-03-20 14:30',
    },
    {
      id: 2,
      caller: '+1 (555) 987-6543',
      duration: '1:45',
      status: 'Missed',
      type: 'Inbound',
      date: '2024-03-20 13:15',
    },
  ]);

  const handleCall = () => {
    setActiveCall(!activeCall);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Receptionist
      </Typography>

      <Grid container spacing={4}>
        {/* Active Call Section */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Call
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">+1 (555) 123-4567</Typography>
                  <Typography color="text.secondary">Incoming Call</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color={activeCall ? 'error' : 'primary'}
                  startIcon={activeCall ? <CallEndIcon /> : <PhoneIcon />}
                  onClick={handleCall}
                >
                  {activeCall ? 'End Call' : 'Answer Call'}
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* AI Settings */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VoiceIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Voice Recognition"
                    secondary="Configure AI voice settings"
                  />
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Call History"
                    secondary="View and manage call logs"
                  />
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Call History */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Calls
              </Typography>
              <List>
                {callHistory.map((call) => (
                  <ListItem
                    key={call.id}
                    secondaryAction={
                      <Chip
                        label={call.status}
                        color={call.status === 'Completed' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                  >
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={call.caller}
                      secondary={`${call.date} • ${call.duration}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIReceptionist; 