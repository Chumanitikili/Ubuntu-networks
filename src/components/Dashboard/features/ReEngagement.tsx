import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
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

const campaigns = [
  {
    id: 1,
    name: 'Inactive Leads Follow-up',
    status: 'Active',
    progress: 75,
    leads: 150,
    responses: 45,
    type: 'Email & SMS',
    nextRun: '2024-03-21 10:00',
  },
  {
    id: 2,
    name: 'Win-back Campaign',
    status: 'Scheduled',
    progress: 0,
    leads: 200,
    responses: 0,
    type: 'Phone & Email',
    nextRun: '2024-03-22 15:00',
  },
];

const ReEngagement = () => {
  const [activeCampaigns, setActiveCampaigns] = useState(campaigns);

  const handleDeleteCampaign = (id: number) => {
    setActiveCampaigns(activeCampaigns.filter(campaign => campaign.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Re-engagement Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Create new campaign')}
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Campaign List */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Campaigns
              </Typography>
              <List>
                {activeCampaigns.map((campaign) => (
                  <ListItem
                    key={campaign.id}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Campaign">
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Campaign">
                          <IconButton onClick={() => handleDeleteCampaign(campaign.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <CampaignIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {campaign.name}
                          <Chip
                            label={campaign.status}
                            color={campaign.status === 'Active' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {campaign.type} • {campaign.leads} leads • {campaign.responses} responses
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Next run: {campaign.nextRun}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={campaign.progress}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Analytics Overview */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campaign Analytics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Campaigns"
                    secondary="2 Active Campaigns"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Leads"
                    secondary="350 Leads in Campaigns"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Response Rate"
                    secondary="12.8% Average Response Rate"
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => console.log('Create campaign')}
                  >
                    Create Campaign
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AnalyticsIcon />}
                    onClick={() => console.log('View analytics')}
                  >
                    View Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReEngagement; 