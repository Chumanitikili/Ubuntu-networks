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
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
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
    name: 'Google Ads Campaign',
    platform: 'Google',
    status: 'Active',
    budget: 1000,
    spent: 450,
    impressions: 15000,
    clicks: 750,
    conversions: 25,
  },
  {
    id: 2,
    name: 'Facebook Ads',
    platform: 'Facebook',
    status: 'Active',
    budget: 800,
    spent: 320,
    impressions: 12000,
    clicks: 600,
    conversions: 18,
  },
];

const PaidAds = () => {
  const [activeCampaigns, setActiveCampaigns] = useState(campaigns);

  const handleDeleteCampaign = (id: number) => {
    setActiveCampaigns(activeCampaigns.filter(campaign => campaign.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Paid Advertising
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
                            label={campaign.platform}
                            color="primary"
                            size="small"
                          />
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
                            Budget: ${campaign.budget} • Spent: ${campaign.spent}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Progress: {Math.round((campaign.spent / campaign.budget) * 100)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(campaign.spent / campaign.budget) * 100}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Impressions: {campaign.impressions.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Clicks: {campaign.clicks.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Conversions: {campaign.conversions}
                            </Typography>
                          </Box>
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
                    <MoneyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Budget"
                    secondary="$1,800"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Conversions"
                    secondary="43 Conversions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Average CTR"
                    secondary="4.5%"
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

export default PaidAds; 