import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Team } from '../../types';

export const getTeams = async (): Promise<Team[]> => {
  const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), teamId: d.id } as Team));
};

export const getActiveTeams = async (): Promise<Team[]> => {
  const q = query(
    collection(db, 'teams'),
    where('active', '==', true),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), teamId: d.id } as Team));
};

export const getTeamById = async (teamId: string): Promise<Team | null> => {
  const docRef = doc(db, 'teams', teamId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), teamId: docSnap.id } as Team;
  }
  return null;
};

export const createTeam = async (teamData: Omit<Team, 'teamId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const newTeamRef = doc(collection(db, 'teams'));
  const team: Team = {
    ...teamData,
    teamId: newTeamRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(newTeamRef, team);
  return newTeamRef.id;
};

export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<void> => {
  const docRef = doc(db, 'teams', teamId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  const docRef = doc(db, 'teams', teamId);
  await deleteDoc(docRef);
};
