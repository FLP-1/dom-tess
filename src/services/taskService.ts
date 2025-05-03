import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  doc, 
  Timestamp, 
  DocumentData, 
  Query, 
  CollectionReference,
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  ITask,
  ITaskFilter,
  ITaskAttachment,
  ETaskPriority
} from '@/types/task';
import { EStatus } from '@/types/common';

export class TaskService {
  private static readonly COLLECTION_NAME = 'tasks';

  static async create(task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> {
    const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
      ...task,
      status: task.status || EStatus.PENDING,
      priority: task.priority || ETaskPriority.MEDIUM,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return {
      id: docRef.id,
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async getAll(userId: string): Promise<ITask[]> {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('assignedTo', '==', userId),
      where('status', '!=', EStatus.DELETED)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      dueDate: doc.data().dueDate.toDate()
    })) as ITask[];
  }

  static async getById(id: string): Promise<ITask | null> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate(),
      dueDate: docSnap.data().dueDate.toDate()
    } as ITask;
  }

  static async update(id: string, data: Partial<ITask>): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  static async updateStatus(id: string, status: EStatus): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  }

  static async updatePriority(id: string, priority: ETaskPriority): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await updateDoc(docRef, {
      priority,
      updatedAt: Timestamp.now()
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status: EStatus.DELETED,
      updatedAt: Timestamp.now()
    });
  }

  static async getTasks(filters: ITaskFilter = {}): Promise<ITask[]> {
    const constraints = [];

    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }

    if (filters.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }

    if (filters.createdBy) {
      constraints.push(where('createdBy', '==', filters.createdBy));
    }

    if (filters.startDate) {
      constraints.push(where('dueDate', '>=', Timestamp.fromDate(filters.startDate)));
    }

    if (filters.endDate) {
      constraints.push(where('dueDate', '<=', Timestamp.fromDate(filters.endDate)));
    }

    constraints.push(where('status', '!=', EStatus.DELETED));

    const q = query(collection(db, this.COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      dueDate: doc.data().dueDate.toDate()
    })) as ITask[];
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    const docRef = doc(db, this.COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate(),
      dueDate: docSnap.data().dueDate.toDate()
    } as ITask;
  }

  static async addAttachment(taskId: string, attachment: ITaskAttachment): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }

    const task = docSnap.data();
    const attachments = task.attachments || [];

    await updateDoc(docRef, {
      attachments: [...attachments, attachment],
      updatedAt: Timestamp.now()
    });
  }

  static async removeAttachment(taskId: string, attachmentUrl: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }

    const task = docSnap.data();
    const attachments = task.attachments || [];

    await updateDoc(docRef, {
      attachments: attachments.filter(att => att.url !== attachmentUrl),
      updatedAt: Timestamp.now()
    });
  }

  static async addComment(taskId: string, comment: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }

    const task = docSnap.data();
    const comments = task.comments || [];

    await updateDoc(docRef, {
      comments: [...comments, comment],
      updatedAt: Timestamp.now()
    });
  }

  static async removeComment(taskId: string, commentIndex: number): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }

    const task = docSnap.data();
    const comments = task.comments || [];

    if (commentIndex < 0 || commentIndex >= comments.length) {
      throw new Error('Invalid comment index');
    }

    comments.splice(commentIndex, 1);

    await updateDoc(docRef, {
      comments,
      updatedAt: Timestamp.now()
    });
  }
} 