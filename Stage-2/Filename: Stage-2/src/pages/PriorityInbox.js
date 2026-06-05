Filename: Stage-2/src/pages/PriorityInbox.js
Content: 
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Chip, Box,
  FormControl, InputLabel, Select, MenuItem,
  TextField, Grid, CircularProgress, Alert,
  Button
} from '@mui/material';
import { fetchNotifications } from '../services/api';

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('');
  const [viewedNotifications, setViewedNotifications] = useState([]);

  useEffect(() => {
    loadPriorityNotifications();
  }, [topN, filterType]);

  const loadPriorityNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchLimit = Math.max(topN * 2, 50);
      const data = await fetchNotifications(fetchLimit, 1, filterType);
      
      let allNotifs = data.notifications || [];
      
      const priorityOrder = { 'placement': 3, 'result': 2, 'event': 1 };
      const sorted = allNotifs.sort((a, b) => {
        const priorityDiff = (priorityOrder[b.Type?.toLowerCase()] || 0) - (priorityOrder[a.Type?.toLowerCase()] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });
      
      setNotifications(sorted.slice(0, topN));
    } catch (err) {
      setError('Failed to load priority notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id) => {
    if (!viewedNotifications.includes(id)) {
      setViewedNotifications([...viewedNotifications, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.ID);
    setViewedNotifications(allIds);
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
      <Typography variant="h4" gutterBottom>Priority Inbox</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Sorted by: Placement → Result → Event, then newest first
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Top N Notifications"
            value={topN}
            onChange={(e) => setTopN(Math.max(1, parseInt(e.target.value) || 10))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter by Type">
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="outlined" fullWidth onClick={markAllAsRead} sx={{ height: '56px' }}>
            Mark All as Read
          </Button>
        </Grid>
      </Grid>

      {notifications.length === 0 ? (
        <Alert severity="info">No notifications found</Alert>
      ) : (
        notifications.map((notif, index) => (
          <Card 
            key={notif.ID} 
            sx={{ 
              mb: 2, 
              opacity: viewedNotifications.includes(notif.ID) ? 0.6 : 1,
              cursor: 'pointer',
              borderLeft: 5,
              borderColor: getTypeColor(notif.Type)
            }}
            onClick={() => markAsViewed(notif.ID)}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" fontWeight="bold">#{index + 1}</Typography>
                  <Typography variant="h6">{notif.Message}</Typography>
                </Box>
                <Chip label={notif.Type} color={getTypeColor(notif.Type)} size="small" />
              </Box>
              <Typography color="textSecondary" variant="body2">{notif.Timestamp}</Typography>
              {!viewedNotifications.includes(notif.ID) && (
                <Chip label="NEW" color="error" size="small" sx={{ mt: 1 }} />
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body2">
          📌 <strong>Priority Order:</strong> Placement (highest) → Result → Event (lowest)<br />
          📅 Within same type, newer notifications appear first<br />
          👉 Click any notification to mark it as viewed
        </Typography>
      </Box>
    </Box>
  );
};

export default PriorityInbox;
