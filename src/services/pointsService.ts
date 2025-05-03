import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, DocumentData, Query, CollectionReference, QuerySnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ITask, ETaskStatus, ETaskPriority } from '../types/task';

export interface UserPoints {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: string[];
  lastUpdated: Date;
}

export class PointsService {
  private static readonly COLLECTION_NAME = 'user_points';
  private static readonly POINTS_PER_LEVEL = 1000;
  private static readonly POINTS_RULES = {
    [ETaskStatus.COMPLETED]: 100,
    [ETaskStatus.IN_PROGRESS]: 50,
    [ETaskPriority.URGENT]: 100,
    [ETaskPriority.HIGH]: 50,
    [ETaskPriority.MEDIUM]: 30,
    [ETaskPriority.LOW]: 10,
  };

  static async updateUserPoints(userId: string, task: ITask, action: 'create' | 'update' | 'complete'): Promise<void> {
    const pointsRef = doc(db, this.COLLECTION_NAME, userId);
    const pointsDoc = await getDocs(pointsRef);
    
    let currentPoints = 0;
    let currentLevel = 1;
    let achievements: string[] = [];

    if (!pointsDoc.empty) {
      const data = pointsDoc.docs[0].data();
      currentPoints = data.totalPoints || 0;
      currentLevel = data.level || 1;
      achievements = data.achievements || [];
    }

    // Calcular pontos baseado na ação
    let pointsToAdd = 0;
    switch (action) {
      case 'create':
        pointsToAdd = this.POINTS_RULES[task.priority];
        break;
      case 'update':
        pointsToAdd = this.POINTS_RULES[task.priority] * 0.5;
        break;
      case 'complete':
        pointsToAdd = this.POINTS_RULES[ETaskStatus.COMPLETED];
        break;
    }

    // Adicionar pontos extras por tempo
    const dueDate = new Date(task.dueDate);
    const completionDate = new Date();
    if (completionDate <= dueDate) {
      pointsToAdd *= 1.2; // 20% de bônus por concluir antes do prazo
    }

    const newTotalPoints = currentPoints + pointsToAdd;
    const newLevel = Math.floor(newTotalPoints / this.POINTS_PER_LEVEL) + 1;

    // Verificar conquistas
    const newAchievements = this.checkAchievements(newTotalPoints, newLevel, achievements);

    await updateDoc(pointsRef, {
      totalPoints: newTotalPoints,
      level: newLevel,
      achievements: newAchievements,
      lastUpdated: Timestamp.now(),
    });
  }

  private static checkAchievements(totalPoints: number, level: number, currentAchievements: string[]): string[] {
    const achievements = [...currentAchievements];
    const newAchievements = [];

    if (totalPoints >= 1000 && !achievements.includes('primeiro_mil')) {
      newAchievements.push('primeiro_mil');
    }
    if (totalPoints >= 5000 && !achievements.includes('cinco_mil')) {
      newAchievements.push('cinco_mil');
    }
    if (level >= 5 && !achievements.includes('nivel_5')) {
      newAchievements.push('nivel_5');
    }
    if (level >= 10 && !achievements.includes('nivel_10')) {
      newAchievements.push('nivel_10');
    }

    return [...achievements, ...newAchievements];
  }

  static async getUserPoints(userId: string): Promise<UserPoints | null> {
    const pointsRef = doc(db, this.COLLECTION_NAME, userId);
    const pointsDoc = await getDocs(pointsRef);

    if (!pointsDoc.empty) {
      const data = pointsDoc.docs[0].data();
      return {
        userId,
        totalPoints: data.totalPoints || 0,
        level: data.level || 1,
        achievements: data.achievements || [],
        lastUpdated: data.lastUpdated.toDate(),
      };
    }

    return null;
  }

  static async getLeaderboard(limit: number = 10): Promise<UserPoints[]> {
    const q: Query<DocumentData> = query(
      collection(db, this.COLLECTION_NAME) as CollectionReference<DocumentData>,
      orderBy('totalPoints', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated.toDate(),
    })) as UserPoints[];
  }
} 