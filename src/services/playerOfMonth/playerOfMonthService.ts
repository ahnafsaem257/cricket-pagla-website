import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { PlayerOfMonth } from '../../types';

export const getPlayerOfMonth = async (month: string, year: number): Promise<PlayerOfMonth | null> => {
  const q = query(
    collection(db, 'playerOfMonth'),
    where('month', '==', month),
    where('year', '==', year),
    where('published', '==', true)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { ...docSnap.data(), id: docSnap.id } as PlayerOfMonth;
  }
  return null;
};

export const getLatestPlayerOfMonth = async (): Promise<PlayerOfMonth | null> => {
  const q = query(
    collection(db, 'playerOfMonth'),
    where('published', '==', true),
    orderBy('year', 'desc'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { ...docSnap.data(), id: docSnap.id } as PlayerOfMonth;
  }
  return null;
};

export const getAllPlayerOfMonth = async (): Promise<PlayerOfMonth[]> => {
  const q = query(collection(db, 'playerOfMonth'), orderBy('year', 'desc'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as PlayerOfMonth));
};

export const createPlayerOfMonth = async (data: Omit<PlayerOfMonth, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const newRef = doc(collection(db, 'playerOfMonth'));
  const record: PlayerOfMonth = {
    ...data,
    id: newRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(newRef, record);
  return newRef.id;
};

export const updatePlayerOfMonth = async (id: string, updates: Partial<PlayerOfMonth>): Promise<void> => {
  const docRef = doc(db, 'playerOfMonth', id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deletePlayerOfMonth = async (id: string): Promise<void> => {
  const docRef = doc(db, 'playerOfMonth', id);
  await deleteDoc(docRef);
};

export const getPlayerOfMonthById = async (id: string): Promise<PlayerOfMonth | null> => {
  const docRef = doc(db, 'playerOfMonth', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id } as PlayerOfMonth;
  }
  return null;
};
