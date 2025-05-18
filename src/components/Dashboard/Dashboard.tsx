import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  useTheme,
  Container,
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TierSystem from './TierSystem';
import AIFeatures from './AIFeatures';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const MetricCard = ({ title, value, icon, color, progress }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color + '20',
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: color + '20',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
          Welcome to Your Dashboard
        </Typography>
        
        <TierSystem />
        <Box sx={{ my: 8 }} />
        <AIFeatures />
      </Box>
    </Container>
  );
};

export default Dashboard;
