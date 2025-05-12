import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

export const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* B2B Metrics */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            B2B Performance
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Active Deals"
                value="24"
                icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
                color={theme.palette.primary.main}
                progress={75}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Conversion Rate"
                value="32%"
                icon={<TrendingUpIcon sx={{ color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
                progress={32}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* B2C Metrics */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            B2C Performance
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Daily Calls"
                value="156"
                icon={<PhoneIcon sx={{ color: theme.palette.secondary.main }} />}
                color={theme.palette.secondary.main}
                progress={85}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Satisfaction"
                value="4.8/5"
                icon={<TrendingUpIcon sx={{ color: theme.palette.warning.main }} />}
                color={theme.palette.warning.main}
                progress={96}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  {
                    type: 'B2B',
                    title: 'New Enterprise Lead',
                    description: 'Acme Corp requested a demo',
                    time: '2 hours ago',
                  },
                  {
                    type: 'B2C',
                    title: 'Customer Support',
                    description: 'Resolved ticket #1234',
                    time: '3 hours ago',
                  },
                  {
                    type: 'B2B',
                    title: 'Contract Signed',
                    description: 'TechStart Inc. - $50k deal',
                    time: '5 hours ago',
                  },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          activity.type === 'B2B'
                            ? theme.palette.primary.main + '20'
                            : theme.palette.secondary.main + '20',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {activity.type === 'B2B' ? (
                        <BusinessIcon sx={{ color: theme.palette.primary.main }} />
                      ) : (
                        <PersonIcon sx={{ color: theme.palette.secondary.main }} />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{activity.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
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
