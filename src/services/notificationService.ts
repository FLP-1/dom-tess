import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Task } from '../types/task';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'chat' | 'system';
  read: boolean;
  data?: any;
  createdAt: Date;
}

export class NotificationService {
  private static readonly COLLECTION_NAME = 'notifications';
  private static messaging: any;

  static async initialize() {
    if (typeof window !== 'undefined') {
      this.messaging = getMessaging();
      
      // Solicitar permissão para notificações
      try {
        const token = await getToken(this.messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        console.log('Token de notificação:', token);
      } catch (err) {
        console.error('Erro ao obter token de notificação:', err);
      }

      // Configurar listener para mensagens em primeiro plano
      onMessage(this.messaging, (payload) => {
        console.log('Mensagem recebida:', payload);
        // Aqui você pode implementar a lógica para mostrar a notificação
        // usando a API de notificações do navegador
      });
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const notificationRef = await addDoc(collection(db, this.COLLECTION_NAME), {
      ...notification,
      createdAt: Timestamp.now(),
    });
    return notificationRef.id;
  }

  static async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Notification[];
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, this.COLLECTION_NAME, notificationId);
    await updateDoc(notificationRef, { read: true });
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
        type: 'task',
        read: false,
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