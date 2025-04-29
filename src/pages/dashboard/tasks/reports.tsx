import React, { useState } from 'react';
import { Box, HStack, Input, Button } from '@chakra-ui/react';
import { TaskReports } from '../../../components/TaskManager/TaskReports';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';

const TaskReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <DashboardLayout>
      <Box p={4}>
        <HStack spacing={4} mb={4}>
          <Input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            aria-label="Data inicial"
          />
          <Input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            aria-label="Data final"
          />
        </HStack>
        <TaskReports startDate={startDate} endDate={endDate} />
      </Box>
    </DashboardLayout>
  );
};

export default TaskReportsPage; 