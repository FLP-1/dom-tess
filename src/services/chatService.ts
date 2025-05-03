import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ITask } from '../types/task';

export interface ChatMessage {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

export class ChatService {
  private static readonly COLLECTION_NAME = 'chat_messages';

  static async sendMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<string> {
    const messageRef = await addDoc(collection(db, this.COLLECTION_NAME), {
      ...message,
      createdAt: Timestamp.now(),
    });
    return messageRef.id;
  }

  static async getMessages(taskId: string): Promise<ChatMessage[]> {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as ChatMessage[];
  }

  static subscribeToMessages(taskId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as ChatMessage[];
      callback(messages);
    });

    return unsubscribe;
  }

  static async sendTaskMessage(task: ITask, userId: string, content: string): Promise<void> {
    await this.sendMessage({
      taskId: task.id,
      userId,
      content,
    });
  }

  static async sendTaskAttachment(task: ITask, userId: string, attachment: { type: string; url: string; name: string }): Promise<void> {
    await this.sendMessage({
      taskId: task.id,
      userId,
      content: `Anexo: ${attachment.name}`,
      attachments: [attachment],
    });
  }
} 