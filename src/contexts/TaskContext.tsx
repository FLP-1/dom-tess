import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, TaskFilter, TaskStatus } from '../types/task';
import { TaskService } from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addComment: (taskId: string, comment: { userId: string; content: string }) => Promise<void>;
  addAttachment: (taskId: string, attachment: { type: string; url: string; name: string }) => Promise<void>;
  filterTasks: (filters: TaskFilter) => Promise<void>;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadTasks = useCallback(async (filters: TaskFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await TaskService.getTasks(filters);
      setTasks(loadedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.createTask(task);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.updateTask(taskId, updates);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.updateTaskStatus(taskId, status);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status da tarefa');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (taskId: string, comment: { userId: string; content: string }) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.addComment(taskId, comment);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar comentário');
    } finally {
      setLoading(false);
    }
  };

  const addAttachment = async (taskId: string, attachment: { type: string; url: string; name: string }) => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.addAttachment(taskId, attachment);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar anexo');
    } finally {
      setLoading(false);
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
        addComment,
        addAttachment,
        filterTasks: loadTasks,
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