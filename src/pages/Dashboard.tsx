import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';

const mockData = {
  stats: [
    { title: 'Total Calls', value: '156', icon: <PhoneIcon />, color: '#2196F3' },
    { title: 'Messages', value: '43', icon: <MessageIcon />, color: '#FF4081' },
    { title: 'Scheduled', value: '12', icon: <ScheduleIcon />, color: '#4CAF50' },
  ],
  recentCalls: [
    {
      name: 'John Smith',
      company: 'Tech Corp',
      time: '5 mins ago',
      type: 'Inbound',
      status: 'Completed',
    },
    {
      name: 'Sarah Johnson',
      company: 'Marketing Inc',
      time: '15 mins ago',
      type: 'Outbound',
      status: 'Scheduled',
    },
    {
      name: 'Michael Brown',
      company: 'Sales Pro',
      time: '1 hour ago',
      type: 'Inbound',
      status: 'Missed',
    },
  ],
};

export default function Dashboard() {
  const [licenseProgress] = useState(65); // Mock license usage progress

  return (
    <Box>
      {/* License Progress Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTime sx={{ color: 'warning.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            POC License Usage (25 days remaining)
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={licenseProgress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'grey.100',
            '& .MuiLinearProgress-bar': {
              backgroundColor: licenseProgress > 80 ? 'error.main' : 'warning.main',
            }
          }} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {licenseProgress}% Used
          </Typography>
          <Typography variant="caption" color="text.secondary">
            90 Days Total
          </Typography>
        </Box>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {mockData.stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    +12% from last week
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Calls */}
      <Card>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Recent Calls</Typography>
          <Button color="primary">View All</Button>
        </Box>
        <List>
          {mockData.recentCalls.map((call, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  {call.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {call.name}
                    <Chip
                      label={call.type}
                      size="small"
                      color={call.type === 'Inbound' ? 'primary' : 'secondary'}
                      sx={{ height: 20 }}
                    />
                    <Chip
                      label={call.status}
                      size="small"
                      color={
                        call.status === 'Completed'
                          ? 'success'
                          : call.status === 'Scheduled'
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {call.company}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {call.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}
