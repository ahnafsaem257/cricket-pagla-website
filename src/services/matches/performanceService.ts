import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { MatchPerformance } from '../../types';

export const getMatchPerformances = async (matchId?: string): Promise<MatchPerformance[]> => {
  let q;
  if (matchId) {
    q = query(collection(db, 'matchPerformances'), where('matchId', '==', matchId));
  } else {
    q = query(collection(db, 'matchPerformances'), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), performanceId: d.id } as MatchPerformance));
};

export const getPlayerPerformances = async (playerId: string): Promise<MatchPerformance[]> => {
  const q = query(
    collection(db, 'matchPerformances'),
    where('playerId', '==', playerId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), performanceId: d.id } as MatchPerformance));
};

export const createMatchPerformance = async (data: Omit<MatchPerformance, 'performanceId' | 'createdAt'>): Promise<string> => {
  const newRef = doc(collection(db, 'matchPerformances'));
  const record: MatchPerformance = {
    ...data,
    performanceId: newRef.id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(newRef, record);
  return newRef.id;
};

export const updateMatchPerformance = async (id: string, updates: Partial<MatchPerformance>): Promise<void> => {
  const docRef = doc(db, 'matchPerformances', id);
  await updateDoc(docRef, updates);
};

export const deleteMatchPerformance = async (id: string): Promise<void> => {
  const docRef = doc(db, 'matchPerformances', id);
  await deleteDoc(docRef);
};

export const getMatchPerformanceById = async (id: string): Promise<MatchPerformance | null> => {
  const docRef = doc(db, 'matchPerformances', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), performanceId: docSnap.id } as MatchPerformance;
  }
  return null;
};
