import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const mockContacts = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Tech Corp',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    type: 'B2B',
    status: 'Active',
    trialDays: 45,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'Marketing Inc',
    email: 'sarah.j@marketing.com',
    phone: '+1 (555) 234-5678',
    type: 'B2C',
    status: 'Trial',
    trialDays: 75,
  },
  {
    id: 3,
    name: 'Michael Brown',
    company: 'Sales Pro',
    email: 'michael@salespro.com',
    phone: '+1 (555) 345-6789',
    type: 'B2B',
    status: 'Expired',
    trialDays: 90,
  },
];

export default function Contacts() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, contactId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contactId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Contacts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add Contact
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search contacts..."
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 300 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ borderRadius: 2 }}
          >
            Filter
          </Button>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Trial Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {contact.name.charAt(0)}
                      </Avatar>
                      <Typography>{contact.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{contact.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{contact.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={contact.type}
                      color={contact.type === 'B2B' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip
                        label={contact.status}
                        color={
                          contact.status === 'Active'
                            ? 'success'
                            : contact.status === 'Trial'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                      {contact.status === 'Trial' && (
                        <Typography variant="caption" color="text.secondary">
                          {90 - contact.trialDays} days remaining
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, contact.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit Contact</MenuItem>
          <MenuItem onClick={handleMenuClose}>Start Call</MenuItem>
          <MenuItem onClick={handleMenuClose}>Send Email</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            Delete Contact
          </MenuItem>
        </Menu>
      </Card>
    </Box>
  );
}
