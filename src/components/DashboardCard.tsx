import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DashboardCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="shadow-md">
    <CardHeader className="flex items-center justify-between p-4">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <div className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </div>
    </CardContent>
  </Card>
);

export default DashboardCard;
