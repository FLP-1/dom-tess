import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

const ALERTS_COLLECTION = 'alerts';

export async function createAlert(data: { title: string; description: string }) {
  return addDoc(collection(db, ALERTS_COLLECTION), {
    ...data,
    createdAt: new Date(),
    unread: true,
  });
}

export async function getAlerts() {
  const snapshot = await getDocs(collection(db, ALERTS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function listenAlerts(callback: (alerts: any[]) => void) {
  return onSnapshot(collection(db, ALERTS_COLLECTION), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export async function getAlert(id: string) {
  const ref = doc(db, ALERTS_COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateAlert(id: string, data: { title: string; description: string }) {
  const ref = doc(db, ALERTS_COLLECTION, id);
  return updateDoc(ref, data);
}

export async function deleteAlert(id: string) {
  const ref = doc(db, ALERTS_COLLECTION, id);
  return deleteDoc(ref);
} 