import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CampaignOverview from '../components/CampaignOverview';
import RecentActivity from '../components/RecentActivity';
import PerformanceMetrics from '../components/PerformanceMetrics';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CampaignOverview />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12}>
          <PerformanceMetrics />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
