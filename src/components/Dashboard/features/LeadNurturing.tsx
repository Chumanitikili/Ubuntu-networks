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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
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

const leads = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Tech Solutions Inc.',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    status: 'Qualified',
    score: 85,
    lastContact: '2024-03-20',
    nextAction: 'Follow-up Call',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'Digital Innovations',
    email: 'sarah@digitalinnovations.com',
    phone: '+1 (555) 987-6543',
    status: 'In Progress',
    score: 65,
    lastContact: '2024-03-19',
    nextAction: 'Send Proposal',
  },
];

const LeadNurturing = () => {
  const [activeLeads, setActiveLeads] = useState(leads);
  const [openLeadDialog, setOpenLeadDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    score: 0,
    nextAction: '',
  });

  const handleDeleteLead = (id: number) => {
    setActiveLeads(activeLeads.filter(lead => lead.id !== id));
  };

  const handleAddLead = () => {
    setActiveLeads([...activeLeads, { ...newLead, id: activeLeads.length + 1, lastContact: new Date().toISOString().split('T')[0] }]);
    setOpenLeadDialog(false);
    setNewLead({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'New',
      score: 0,
      nextAction: '',
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Lead Nurturing
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenLeadDialog(true)}
        >
          Add Lead
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Leads List */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Leads
              </Typography>
              <List>
                {activeLeads.map((lead) => (
                  <ListItem
                    key={lead.id}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Lead">
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Lead">
                          <IconButton onClick={() => handleDeleteLead(lead.id)}>
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
                          {lead.name}
                          <Chip
                            label={lead.status}
                            color={
                              lead.status === 'Qualified' ? 'success' :
                              lead.status === 'In Progress' ? 'primary' : 'default'
                            }
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {lead.company} • {lead.email} • {lead.phone}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <TimelineIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Next Action: {lead.nextAction}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Lead Score: {lead.score}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={lead.score}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
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

        {/* Lead Analytics */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Analytics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Leads"
                    secondary="2 Active Leads"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Average Lead Score"
                    secondary="75%"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Engagement"
                    secondary="85% Open Rate"
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
                    startIcon={<EmailIcon />}
                    onClick={() => console.log('Send email campaign')}
                  >
                    Email Campaign
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PhoneIcon />}
                    onClick={() => console.log('Schedule calls')}
                  >
                    Schedule Calls
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Add Lead Dialog */}
      <Dialog open={openLeadDialog} onClose={() => setOpenLeadDialog(false)}>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Company"
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newLead.status}
                label="Status"
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Lead Score"
              type="number"
              value={newLead.score}
              onChange={(e) => setNewLead({ ...newLead, score: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Next Action"
              value={newLead.nextAction}
              onChange={(e) => setNewLead({ ...newLead, nextAction: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLeadDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLead} variant="contained">
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadNurturing; 