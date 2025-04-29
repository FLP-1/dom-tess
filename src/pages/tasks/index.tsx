import React from 'react';
import { TaskManager } from '../../components/TaskManager/TaskManager';
import { TaskProvider } from '../../contexts/TaskContext';
import { Layout } from '../../components/Layout';

const TasksPage: React.FC = () => {
  return (
    <Layout>
      <TaskProvider>
        <TaskManager />
      </TaskProvider>
    </Layout>
  );
};

export default TasksPage; 