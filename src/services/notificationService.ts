import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Task } from '../types/task';

export enum NotificationType {
  TASK = 'TASK',
  DOCUMENT = 'DOCUMENT',
  SYSTEM = 'SYSTEM',
  ALERT = 'ALERT'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilter {
  type?: NotificationType;
  status?: NotificationStatus;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
}

export class NotificationService {
  private static readonly COLLECTION_NAME = 'notifications';

  static async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const docRef = doc(db, this.COLLECTION_NAME);
    const newNotification: Notification = {
      ...notification,
      id: docRef.id,
      status: NotificationStatus.UNREAD,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(docRef, newNotification);
    return newNotification;
  }

  static async getNotifications(filter: NotificationFilter = {}): Promise<NotificationListResponse> {
    const constraints: QueryConstraint[] = [];

    if (filter.type) {
      constraints.push(where('type', '==', filter.type));
    }

    if (filter.status) {
      constraints.push(where('status', '==', filter.status));
    }

    if (filter.startDate) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(filter.startDate)));
    }

    if (filter.endDate) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(filter.endDate)));
    }

    if (filter.userId) {
      constraints.push(where('userId', '==', filter.userId));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, this.COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Notification[];

    return {
      notifications,
      total: notifications.length
    };
  }

  static async getNotificationById(id: string): Promise<Notification | null> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Notification;
  }

  static async updateNotification(id: string, data: Partial<Notification>): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date()
      },
      { merge: true }
    );
  }

  static async markAsRead(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await setDoc(
      docRef,
      {
        status: NotificationStatus.READ,
        updatedAt: new Date()
      },
      { merge: true }
    );
  }

  static async markAsArchived(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await setDoc(
      docRef,
      {
        status: NotificationStatus.ARCHIVED,
        updatedAt: new Date()
      },
      { merge: true }
    );
  }

  static async deleteNotification(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  static async initialize() {
    if (typeof window !== 'undefined') {
      const messaging = getMessaging();
      
      // Solicitar permissão para notificações
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        console.log('Token de notificação:', token);
      } catch (err) {
        console.error('Erro ao obter token de notificação:', err);
      }

      // Configurar listener para mensagens em primeiro plano
      onMessage(messaging, (payload) => {
        console.log('Mensagem recebida:', payload);
        // Aqui você pode implementar a lógica para mostrar a notificação
        // usando a API de notificações do navegador
      });
    }
  }

  static async sendTaskNotification(task: Task, type: 'created' | 'updated' | 'assigned' | 'completed'): Promise<void> {
    const title = {
      created: 'Nova tarefa criada',
      updated: 'Tarefa atualizada',
      assigned: 'Você foi atribuído a uma tarefa',
      completed: 'Tarefa concluída',
    }[type];

    const message = {
      created: `Nova tarefa: ${task.title}`,
      updated: `A tarefa "${task.title}" foi atualizada`,
      assigned: `Você foi atribuído à tarefa "${task.title}"`,
      completed: `A tarefa "${task.title}" foi concluída`,
    }[type];

    // Enviar notificação para todos os usuários atribuídos
    for (const userId of task.assignedTo) {
      await this.createNotification({
        userId,
        title,
        message,
        type: NotificationType.TASK,
        status: NotificationStatus.UNREAD,
        data: { taskId: task.id },
      });
    }
  }
}

// Função mock para envio de push notification via Firebase Cloud Messaging
export async function sendPushNotification(alert: { title: string; description: string }, users: string[] = []) {
  // Aqui você integraria com o backend ou função cloud que dispara o FCM
  // Exemplo: fetch('/api/sendPush', { method: 'POST', body: JSON.stringify({ alert, users }) })
  console.log('Enviando push notification:', alert, 'para usuários:', users);
  // Simulação de delay
  await new Promise(res => setTimeout(res, 500));
  return true;
}

// Função mock para envio de SMS (exemplo: Twilio)
export async function sendSMS(alert: { title: string; description: string }, users: string[] = []) {
  // Aqui você integraria com o backend ou serviço de SMS
  // Exemplo: fetch('/api/sendSMS', { method: 'POST', body: JSON.stringify({ alert, users }) })
  console.log('Enviando SMS:', alert, 'para usuários:', users);
  // Simulação de delay
  await new Promise(res => setTimeout(res, 500));
  return true;
} 