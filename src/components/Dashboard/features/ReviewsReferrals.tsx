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
  Rating,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Star as StarIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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

const reviews = [
  {
    id: 1,
    customer: 'John Smith',
    rating: 5,
    comment: 'Excellent service! The AI receptionist was very helpful.',
    date: '2024-03-20',
    platform: 'Google',
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    rating: 4,
    comment: 'Great experience overall. Would recommend.',
    date: '2024-03-19',
    platform: 'Facebook',
  },
];

const referrals = [
  {
    id: 1,
    referrer: 'John Smith',
    referred: 'Mike Brown',
    status: 'Converted',
    date: '2024-03-20',
    reward: '$50',
  },
  {
    id: 2,
    referrer: 'Sarah Johnson',
    referred: 'Lisa White',
    status: 'Pending',
    date: '2024-03-19',
    reward: 'Pending',
  },
];

const ReviewsReferrals = () => {
  const [activeReviews, setActiveReviews] = useState(reviews);
  const [activeReferrals, setActiveReferrals] = useState(referrals);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    customer: '',
    rating: 5,
    comment: '',
    platform: 'Google',
  });

  const handleDeleteReview = (id: number) => {
    setActiveReviews(activeReviews.filter(review => review.id !== id));
  };

  const handleDeleteReferral = (id: number) => {
    setActiveReferrals(activeReferrals.filter(referral => referral.id !== id));
  };

  const handleAddReview = () => {
    setActiveReviews([...activeReviews, { ...newReview, id: activeReviews.length + 1, date: new Date().toISOString().split('T')[0] }]);
    setOpenReviewDialog(false);
    setNewReview({
      customer: '',
      rating: 5,
      comment: '',
      platform: 'Google',
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Reviews & Referrals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenReviewDialog(true)}
        >
          Add Review
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Reviews Section */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reviews
              </Typography>
              <List>
                {activeReviews.map((review) => (
                  <React.Fragment key={review.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteReview(review.id)}>
                            <DeleteIcon />
                          </IconButton>
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
                            {review.customer}
                            <Chip
                              label={review.platform}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {review.comment}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Referrals Section */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referral Program
              </Typography>
              <List>
                {activeReferrals.map((referral) => (
                  <React.Fragment key={referral.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton>
                            <ShareIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteReferral(referral.id)}>
                            <DeleteIcon />
                          </IconButton>
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
                            {referral.referrer} → {referral.referred}
                            <Chip
                              label={referral.status}
                              color={referral.status === 'Converted' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Reward: {referral.reward}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {referral.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Add Review Dialog */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Add New Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={newReview.customer}
              onChange={(e) => setNewReview({ ...newReview, customer: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={newReview.rating}
                onChange={(_, value) => setNewReview({ ...newReview, rating: value || 5 })}
              />
            </Box>
            <TextField
              fullWidth
              label="Review Comment"
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Platform"
              value={newReview.platform}
              onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReview} variant="contained">
            Add Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewsReferrals; 