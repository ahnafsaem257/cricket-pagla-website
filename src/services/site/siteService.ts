import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { SiteSettings, ClubStats } from '../../types';

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const docRef = doc(db, 'siteSettings', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as SiteSettings;
  }
  return null;
};

export const updateSiteSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
  const docRef = doc(db, 'siteSettings', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } else {
    await setDoc(docRef, {
      ...updates,
      id: 'main',
      updatedAt: new Date().toISOString(),
    } as SiteSettings);
  }
};

export const getClubStats = async (): Promise<ClubStats | null> => {
  const docRef = doc(db, 'clubStats', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as ClubStats;
  }
  return null;
};

export const updateClubStats = async (updates: Partial<ClubStats>): Promise<void> => {
  const docRef = doc(db, 'clubStats', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } else {
    await setDoc(docRef, {
      ...updates,
      id: 'main',
      totalPlayers: 0,
      totalMatches: 0,
      totalTournaments: 0,
      yearsActive: 0,
      totalWins: 0,
      updatedAt: new Date().toISOString(),
    } as ClubStats);
  }
};
