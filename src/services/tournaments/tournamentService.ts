import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Tournament } from '../../types';

export const getTournaments = async (): Promise<Tournament[]> => {
  const q = query(collection(db, 'tournaments'), orderBy('startDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), tournamentId: doc.id } as Tournament));
};

export const getPublishedTournaments = async (): Promise<Tournament[]> => {
  const q = query(collection(db, 'tournaments'), orderBy('startDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ ...doc.data(), tournamentId: doc.id } as Tournament))
    .filter(t => t.published);
};

export const getTournamentById = async (tournamentId: string): Promise<Tournament | null> => {
  const docRef = doc(db, 'tournaments', tournamentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), tournamentId: docSnap.id } as Tournament;
  }
  return null;
};

export const createTournament = async (
  tournamentData: Omit<Tournament, 'tournamentId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const newTournamentRef = doc(collection(db, 'tournaments'));

  const tournament: Tournament = {
    ...tournamentData,
    tournamentId: newTournamentRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newTournamentRef, tournament);
  return newTournamentRef.id;
};

export const updateTournament = async (
  tournamentId: string,
  updates: Partial<Tournament>
): Promise<void> => {
  const docRef = doc(db, 'tournaments', tournamentId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteTournament = async (tournamentId: string): Promise<void> => {
  const docRef = doc(db, 'tournaments', tournamentId);
  await deleteDoc(docRef);
};