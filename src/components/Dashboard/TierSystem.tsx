import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const features = {
  poc: [
    '90-day trial access',
    'Basic call handling',
    'Limited AI receptionist',
    'Basic lead tracking',
    'Email support',
  ],
  admin: [
    'Full system access',
    'Advanced AI features',
    'Unlimited call handling',
    'Complete lead management',
    'Priority support',
    'Custom workflows',
    'Team management',
  ],
  paid: [
    'All admin features',
    'Advanced analytics',
    'Custom integrations',
    'Dedicated support',
    'API access',
    'White-label options',
    'Training sessions',
  ],
};

const TierSystem = () => {
  const navigate = useNavigate();

  const handleUpgrade = (tier: string) => {
    // TODO: Implement upgrade logic
    console.log(`Upgrading to ${tier} tier`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Choose Your Plan
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {/* POC Tier */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                90-Day POC
              </Typography>
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                Free
              </Typography>
              <List>
                {features.poc.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpgrade('poc')}
                  fullWidth
                >
                  Start Trial
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Admin Tier */}
        <Grid item xs={12} md={4}>
          <StyledCard sx={{ border: '2px solid #1976d2' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Admin
              </Typography>
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                Custom
              </Typography>
              <List>
                {features.admin.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpgrade('admin')}
                  fullWidth
                >
                  Contact Sales
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Paid Tier */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Enterprise
              </Typography>
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                Custom
              </Typography>
              <List>
                {features.paid.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpgrade('paid')}
                  fullWidth
                >
                  Contact Sales
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TierSystem; 