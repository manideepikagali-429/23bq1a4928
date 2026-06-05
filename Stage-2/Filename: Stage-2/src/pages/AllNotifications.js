Filename: Stage-2/src/pages/AllNotifications.js
Content: import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Chip, Box, 
  Pagination, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert 
} from '@mui/material';
import { fetchNotifications } from '../services/api';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [viewedNotifications, setViewedNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [page, limit]);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(limit, page);
      setNotifications(data.notifications || []);
      setTotalPages(Math.ceil((data.total || 100) / limit));
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id) => {
    if (!viewedNotifications.includes(id)) {
      setViewedNotifications([...viewedNotifications, id]);
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'placement': return 'success';
      case 'result': return 'primary';
      case 'event': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select value={limit} onChange={(e) => setLimit(e.target.value)} label="Items per page">
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {notifications.map((notif) => (
        <Card 
          key={notif.ID} 
          sx={{ 
            mb: 2, 
            opacity: viewedNotifications.includes(notif.ID) ? 0.6 : 1,
            cursor: 'pointer'
          }}
          onClick={() => markAsViewed(notif.ID)}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{notif.Message}</Typography>
              <Chip 
                label={notif.Type} 
                color={getTypeColor(notif.Type)}
                size="small"
              />
            </Box>
            <Typography color="textSecondary" variant="body2">
              {notif.Timestamp}
            </Typography>
            {!viewedNotifications.includes(notif.ID) && (
              <Chip label="NEW" color="error" size="small" sx={{ mt: 1 }} />
            )}
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AllNotifications;
