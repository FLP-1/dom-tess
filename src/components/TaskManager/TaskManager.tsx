import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useTask } from '../../contexts/TaskContext';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { TaskFilter } from './TaskFilter';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './TaskManager.module.css';

const statusColumns = [
  { id: TaskStatus.NOT_STARTED, title: 'Não Iniciado' },
  { id: TaskStatus.PENDING, title: 'Pendente' },
  { id: TaskStatus.IN_PROGRESS, title: 'Em Andamento' },
  { id: TaskStatus.COMPLETED, title: 'Concluído' },
  { id: TaskStatus.CANCELLED, title: 'Cancelado' },
];

export const TaskManager: React.FC = () => {
  const { tasks, loading, error, updateTaskStatus, filterTasks } = useTask();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    search: '',
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;

    try {
      await updateTaskStatus(taskId, newStatus);
      message.success('Status da tarefa atualizado com sucesso');
    } catch (err) {
      message.error('Erro ao atualizar status da tarefa');
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    filterTasks(newFilters);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gerenciamento de Tarefas</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedTask(null);
            setIsModalVisible(true);
          }}
        >
          Nova Tarefa
        </Button>
      </div>

      <TaskFilter onFilterChange={handleFilterChange} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {statusColumns.map(column => (
            <div key={column.id} className={styles.column}>
              <h2>{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.taskList}
                  >
                    {tasksByStatus[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => {
                                setSelectedTask(task);
                                setIsModalVisible(true);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        title={selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <TaskForm
          task={selectedTask}
          onClose={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
}; 