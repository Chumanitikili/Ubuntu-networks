import React from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import CampaignIcon from '@mui/icons-material/Campaign';
import StarIcon from '@mui/icons-material/Star';
import ChatIcon from '@mui/icons-material/Chat';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const features = [
  {
    title: 'AI Receptionist',
    description: 'Handle incoming calls with intelligent routing and response',
    icon: <PhoneIcon fontSize="large" color="primary" />,
    path: '/ai-receptionist',
  },
  {
    title: 'Re-engagement Campaigns',
    description: 'Automated campaigns to re-engage inactive leads',
    icon: <CampaignIcon fontSize="large" color="primary" />,
    path: '/re-engagement',
  },
  {
    title: 'Reviews & Referrals',
    description: 'Collect and manage customer reviews and referrals',
    icon: <StarIcon fontSize="large" color="primary" />,
    path: '/reviews',
  },
  {
    title: 'Lead Nurturing',
    description: 'Automated lead nurturing and follow-up sequences',
    icon: <ChatIcon fontSize="large" color="primary" />,
    path: '/lead-nurturing',
  },
  {
    title: 'Paid Ads Integration',
    description: 'Track and optimize paid advertising campaigns',
    icon: <AdsClickIcon fontSize="large" color="primary" />,
    path: '/paid-ads',
  },
  {
    title: 'Sales Coaching',
    description: 'AI-powered sales coaching and performance tracking',
    icon: <SchoolIcon fontSize="large" color="primary" />,
    path: '/sales-coaching',
  },
];

const AIFeatures = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        AI-Powered Features
      </Typography>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Tooltip title={feature.title}>
                    <IconButton
                      size="large"
                      onClick={() => handleFeatureClick(feature.path)}
                      sx={{ mb: 2 }}
                    >
                      {feature.icon}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="h6" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </Box>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AIFeatures; 