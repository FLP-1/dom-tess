'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ITask, ITaskFilter, ETaskStatus } from '../types/task';
import { TaskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextData {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<ITask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: ETaskStatus) => Promise<void>;
  addAttachment: (taskId: string, attachment: Omit<ITaskAttachment, 'id' | 'uploadedAt'>) => Promise<void>;
  loadTasks: (filters?: ITaskFilter) => Promise<void>;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadTasks = useCallback(async (filters?: ITaskFilter) => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await TaskService.getTasks(filters);
      setTasks(loadedTasks);
    } catch (err) {
      setError('Erro ao carregar tarefas');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await TaskService.create(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError('Erro ao criar tarefa');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<ITask>) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.update(taskId, updates);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      setError('Erro ao atualizar tarefa');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Erro ao excluir tarefa');
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: ETaskStatus) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.updateStatus(taskId, status);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status da tarefa');
      console.error('Error updating task status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttachment = async (taskId: string, attachment: Omit<ITaskAttachment, 'id' | 'uploadedAt'>) => {
    try {
      const newAttachment: ITaskAttachment = {
        ...attachment,
        id: uuidv4(),
        uploadedAt: new Date()
      };
      await TaskService.addAttachment(taskId, newAttachment);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                attachments: [...(task.attachments || []), newAttachment]
              }
            : task
        )
      );
    } catch (error) {
      console.error('Erro ao adicionar anexo:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        addAttachment,
        loadTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 