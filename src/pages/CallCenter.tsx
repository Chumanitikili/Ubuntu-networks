import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CallCenter() {
  const [tabValue, setTabValue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeMuted, setIsVolumeMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCall = () => {
    setIsInCall(!isInCall);
    // In a real app, we would start/end the call here
  };

  return (
    <Grid container spacing={3}>
      {/* Left Panel - Call Controls */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', minHeight: 600 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Active Call</Typography>
              {isInCall && (
                <Chip
                  label={callDuration}
                  color="primary"
                  icon={<PhoneIcon />}
                />
              )}
            </Box>

            {/* Call Information */}
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}
              >
                JS
              </Avatar>
              <Typography variant="h5" gutterBottom>
                John Smith
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Tech Corp • Premium Customer
              </Typography>
              <Chip label="B2B Account" color="primary" sx={{ mr: 1 }} />
              <Chip label="90-Day Trial" color="warning" />
            </Box>

            {/* Call Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <IconButton
                sx={{
                  backgroundColor: isMuted ? 'error.light' : 'grey.200',
                  '&:hover': { backgroundColor: isMuted ? 'error.main' : 'grey.300' },
                }}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: isInCall ? 'error.main' : 'success.main',
                  color: 'white',
                  width: 64,
                  height: 64,
                  '&:hover': {
                    backgroundColor: isInCall ? 'error.dark' : 'success.dark',
                  },
                }}
                onClick={handleCall}
              >
                {isInCall ? <CallEndIcon /> : <PhoneIcon />}
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: isVolumeMuted ? 'error.light' : 'grey.200',
                  '&:hover': { backgroundColor: isVolumeMuted ? 'error.main' : 'grey.300' },
                }}
                onClick={() => setIsVolumeMuted(!isVolumeMuted)}
              >
                {isVolumeMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ChatIcon />}
                sx={{ borderRadius: 4 }}
              >
                Send Message
              </Button>
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ borderRadius: 4 }}
              >
                Schedule Follow-up
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                sx={{ borderRadius: 4 }}
              >
                Create Task
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Panel - Customer Info & Notes */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', minHeight: 600 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Customer Info" />
              <Tab label="Notes" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Account Details"
                  secondary="Enterprise Plan • Since Jan 2024"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Contact Information"
                  secondary="john.smith@techcorp.com • +1 (555) 123-4567"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ChatIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Last Interaction"
                  secondary="Technical Support • 3 days ago"
                />
              </ListItem>
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Add call notes..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Save Notes
            </Button>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Previous Notes
              </Typography>
              <List>
                {[1, 2, 3].map((note) => (
                  <ListItem key={note} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`Call Note - ${new Date().toLocaleDateString()}`}
                      secondary="Discussed technical requirements for new integration..."
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>
        </Card>
      </Grid>
    </Grid>
  );
}
