import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Innings } from '../../types';

export const getInningsByMatch = async (matchId: string): Promise<Innings[]> => {
  const q = query(collection(db, 'innings'), where('matchId', '==', matchId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), inningsId: d.id } as Innings));
};

export const createInnings = async (data: Omit<Innings, 'inningsId' | 'createdAt'>): Promise<string> => {
  const newRef = doc(collection(db, 'innings'));
  const innings: Innings = {
    ...data,
    inningsId: newRef.id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(newRef, innings);
  return newRef.id;
};

export const updateInnings = async (inningsId: string, updates: Partial<Innings>): Promise<void> => {
  const docRef = doc(db, 'innings', inningsId);
  await updateDoc(docRef, updates);
};

export const deleteInnings = async (inningsId: string): Promise<void> => {
  const docRef = doc(db, 'innings', inningsId);
  await deleteDoc(docRef);
};
