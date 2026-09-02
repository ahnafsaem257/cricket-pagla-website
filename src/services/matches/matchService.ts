import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Match } from '../../types';

export const getMatches = async (): Promise<Match[]> => {
  const q = query(collection(db, 'matches'), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), matchId: doc.id } as Match));
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const docRef = doc(db, 'matches', matchId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { ...docSnap.data(), matchId: docSnap.id } as Match;
  }
  return null;
};

export const createMatch = async (matchData: Omit<Match, 'matchId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const newMatchRef = doc(collection(db, 'matches'));
  
  const match: Match = {
    ...matchData,
    matchId: newMatchRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newMatchRef, match);
  return newMatchRef.id;
};

export const updateMatch = async (matchId: string, updates: Partial<Match>): Promise<void> => {
  const docRef = doc(db, 'matches', matchId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  const docRef = doc(db, 'matches', matchId);
  await deleteDoc(docRef);
};
