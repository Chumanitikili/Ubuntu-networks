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
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as TrophyIcon,
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

const salesReps = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Senior Sales Rep',
    performance: 92,
    deals: 15,
    revenue: 150000,
    training: 'Advanced Negotiation',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Sales Rep',
    performance: 85,
    deals: 12,
    revenue: 120000,
    training: 'Product Knowledge',
  },
];

const SalesCoaching = () => {
  const [activeReps, setActiveReps] = useState(salesReps);

  const handleDeleteRep = (id: number) => {
    setActiveReps(activeReps.filter(rep => rep.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Sales Coaching
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Add new sales rep')}
        >
          Add Sales Rep
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Sales Reps List */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Team Performance
              </Typography>
              <List>
                {activeReps.map((rep) => (
                  <ListItem
                    key={rep.id}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Rep">
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Rep">
                          <IconButton onClick={() => handleDeleteRep(rep.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {rep.name}
                          <Chip
                            label={rep.role}
                            color="primary"
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Deals: {rep.deals} • Revenue: ${rep.revenue.toLocaleString()}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Performance Score: {rep.performance}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={rep.performance}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <SchoolIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Current Training: {rep.training}
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

        {/* Performance Analytics */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Analytics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssessmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Average Performance"
                    secondary="88.5%"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Deals"
                    secondary="27 Deals"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssessmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Revenue"
                    secondary="$270,000"
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
                    startIcon={<SchoolIcon />}
                    onClick={() => console.log('Schedule training')}
                  >
                    Schedule Training
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    onClick={() => console.log('View performance')}
                  >
                    View Performance
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

export default SalesCoaching; 