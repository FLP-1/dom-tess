import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, getDocs, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, TaskFilter, TaskStatus } from '../types/task';

export class TaskService {
  private static readonly COLLECTION_NAME = 'tasks';

  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskRef = await addDoc(collection(db, this.COLLECTION_NAME), {
      ...task,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return taskRef.id;
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, this.COLLECTION_NAME, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  static async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, this.COLLECTION_NAME, taskId);
    await deleteDoc(taskRef);
  }

  static async getTasks(filters: TaskFilter = {}): Promise<Task[]> {
    let q = collection(db, this.COLLECTION_NAME);

    if (filters.status?.length) {
      q = query(q, where('status', 'in', filters.status));
    }

    if (filters.priority?.length) {
      q = query(q, where('priority', 'in', filters.priority));
    }

    if (filters.assignedTo?.length) {
      q = query(q, where('assignedTo', 'array-contains-any', filters.assignedTo));
    }

    if (filters.dueDateFrom) {
      q = query(q, where('dueDate', '>=', Timestamp.fromDate(filters.dueDateFrom)));
    }

    if (filters.dueDateTo) {
      q = query(q, where('dueDate', '<=', Timestamp.fromDate(filters.dueDateTo)));
    }

    if (filters.teamId) {
      q = query(q, where('teamId', '==', filters.teamId));
    }

    q = query(q, orderBy('dueDate', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      dueDate: doc.data().dueDate.toDate(),
    })) as Task[];
  }

  static async getTaskById(taskId: string): Promise<Task | null> {
    const taskRef = doc(db, this.COLLECTION_NAME, taskId);
    const taskDoc = await getDocs(taskRef);
    
    if (!taskDoc.exists()) {
      return null;
    }

    return {
      id: taskDoc.id,
      ...taskDoc.data(),
      createdAt: taskDoc.data().createdAt.toDate(),
      updatedAt: taskDoc.data().updatedAt.toDate(),
      dueDate: taskDoc.data().dueDate.toDate(),
    } as Task;
  }

  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await this.updateTask(taskId, { status });
  }

  static async addComment(taskId: string, comment: { userId: string; content: string }): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    const newComment = {
      id: crypto.randomUUID(),
      ...comment,
      createdAt: new Date(),
    };

    await this.updateTask(taskId, {
      comments: [...(task.comments || []), newComment],
    });
  }

  static async addAttachment(taskId: string, attachment: { type: string; url: string; name: string }): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    const newAttachment = {
      id: crypto.randomUUID(),
      ...attachment,
      uploadedAt: new Date(),
    };

    await this.updateTask(taskId, {
      attachments: [...(task.attachments || []), newAttachment],
    });
  }
} 