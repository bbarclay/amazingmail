import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const CampaignOverview: React.FC = () => {
  // Mock data - replace with actual data fetching logic
  const campaigns = [
    { id: 1, name: 'Summer Sale', status: 'Active', sentEmails: 1000, openRate: '25%' },
    { id: 2, name: 'New Product Launch', status: 'Scheduled', sentEmails: 0, openRate: 'N/A' },
    { id: 3, name: 'Customer Feedback', status: 'Completed', sentEmails: 500, openRate: '40%' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Campaign Overview
        </Typography>
        <List>
          {campaigns.map((campaign) => (
            <ListItem key={campaign.id} divider>
              <ListItemText
                primary={campaign.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      Status: {campaign.status}
                    </Typography>
                    {' — '}
                    Sent: {campaign.sentEmails}, Open Rate: {campaign.openRate}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CampaignOverview;
