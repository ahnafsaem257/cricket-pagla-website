import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Player } from '../../types';

export const getPlayers = async (): Promise<Player[]> => {
  const q = query(collection(db, 'players'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), playerId: doc.id } as Player));
};

export const getPlayerById = async (playerId: string): Promise<Player | null> => {
  const docRef = doc(db, 'players', playerId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { ...docSnap.data(), playerId: docSnap.id } as Player;
  }
  return null;
};

export const createPlayer = async (playerData: Omit<Player, 'playerId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const newPlayerRef = doc(collection(db, 'players'));
  
  const player: Player = {
    ...playerData,
    playerId: newPlayerRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newPlayerRef, player);
  return newPlayerRef.id;
};

export const updatePlayer = async (playerId: string, updates: Partial<Player>): Promise<void> => {
  const docRef = doc(db, 'players', playerId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deletePlayer = async (playerId: string): Promise<void> => {
  const docRef = doc(db, 'players', playerId);
  await deleteDoc(docRef);
};
