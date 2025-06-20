// src/components/dashboard/DashboardCard.jsx
import React from 'react';
import Card from '@/common/Card';
import Icon from '@/common/Icon';

const DashboardCard = ({ icon, title, value, ...props }) => (
  <Card
    icon={<Icon name={icon} size={38} />}
    title={title}
    description={value}
    {...props}
  />
);

export default DashboardCard;
