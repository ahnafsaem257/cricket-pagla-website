import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Player, PlayingRole } from '../../types';

export const getPlayers = async (): Promise<Player[]> => {
  const q = query(collection(db, 'players'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), playerId: d.id } as Player));
};

export const getActivePlayers = async (): Promise<Player[]> => {
  const q = query(
    collection(db, 'players'),
    where('status', 'in', ['Active', 'Injured']),
    orderBy('fullName', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), playerId: d.id } as Player));
};

export const getPlayersByRole = async (role: PlayingRole): Promise<Player[]> => {
  const q = query(
    collection(db, 'players'),
    where('playingRole', '==', role),
    where('status', 'in', ['Active', 'Injured']),
    orderBy('fullName', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ ...d.data(), playerId: d.id } as Player));
};

export const getPlayerById = async (playerId: string): Promise<Player | null> => {
  const docRef = doc(db, 'players', playerId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), playerId: docSnap.id } as Player;
  }
  return null;
};

export const getPlayerByUserId = async (userId: string): Promise<Player | null> => {
  const q = query(collection(db, 'players'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
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

export const findPlayerByName = async (fullName: string): Promise<Player | null> => {
  const normalized = fullName.trim().toLowerCase();
  const snapshot = await getDocs(collection(db, 'players'));
  const match = snapshot.docs.find(d => {
    const data = d.data();
    return data.fullName?.trim().toLowerCase() === normalized;
  });
  if (match) {
    return { ...match.data(), playerId: match.id } as Player;
  }
  return null;
};

export const seedAllPlayers = async (): Promise<{ created: number; updated: number; skipped: number }> => {
  const allPlayers = getAllPlayerData();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const snapshot = await getDocs(collection(db, 'players'));
  const existingMap = new Map<string, string>();
  snapshot.docs.forEach(d => {
    const data = d.data();
    if (data.fullName) {
      existingMap.set(data.fullName.trim().toLowerCase(), d.id);
    }
  });

  const batch = writeBatch(db);
  let batchSize = 0;

  for (const player of allPlayers) {
    const normalizedName = player.fullName.trim().toLowerCase();
    const existingId = existingMap.get(normalizedName);

    if (existingId) {
      const docRef = doc(db, 'players', existingId);
      batch.update(docRef, {
        playingRole: player.playingRole,
        jerseyNumber: player.jerseyNumber ?? null,
        team: player.team ?? 'Cricket Pagla',
        status: player.status ?? 'Active',
        updatedAt: new Date().toISOString()
      });
      updated++;
      batchSize++;
    } else {
      const newDocRef = doc(collection(db, 'players'));
      batch.set(newDocRef, {
        ...player,
        playerId: newDocRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      created++;
      batchSize++;
    }

    if (batchSize >= 500) {
      await batch.commit();
      batchSize = 0;
    }
  }

  if (batchSize > 0) {
    await batch.commit();
  }

  return { created, updated, skipped };
};

function getAllPlayerData(): Omit<Player, 'playerId' | 'createdAt' | 'updatedAt'>[] {
  const team = 'Cricket Pagla';
  const status = 'Active' as const;

  return [
    // ALL ROUNDERS (21)
    { fullName: 'Ahnaf Saem', playingRole: 'All-Rounder' as const, jerseyNumber: 119, team, status },
    { fullName: 'Ali', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Anowar Khan', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Arif', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Arif Ullah', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Ariyan Lezan', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Ashikur Rahman', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Azizul Hakim Nahid', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Emon Das', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Hasnain', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Iftekar Rakib', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Isbat Uddin Ifty', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Jabir Hossain Jabir', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Nur Hasan', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Sa Shifat', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Sagar', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Shad', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Shoriot', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Tahamim', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Tofa', playingRole: 'All-Rounder' as const, team, status },
    { fullName: 'Towhid', playingRole: 'All-Rounder' as const, team, status },

    // BOWLERS (4)
    { fullName: 'Afsar', playingRole: 'Bowler' as const, team, status },
    { fullName: 'Khayer', playingRole: 'Bowler' as const, team, status },
    { fullName: 'Md Sojib', playingRole: 'Bowler' as const, team, status },
    { fullName: 'Sd Rony', playingRole: 'Bowler' as const, team, status },

    // BATTERS (13)
    { fullName: 'Adnan Rb', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Altaf Mahamood Zahed', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Aminul Islam Ontor', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Asm Rashed', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Jahed Joy', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Jamir Uddin Chy', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Jamshed', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Lutful Kabir', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Masud', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Mazid Chowdhury', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Miraz Meher', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Mohammad Maruf', playingRole: 'Batsman' as const, team, status },
    { fullName: 'Mohiuddin Manik', playingRole: 'Batsman' as const, team, status },

    // WICKET KEEPER (1)
    { fullName: 'Yasin Arafat', playingRole: 'Wicket Keeper' as const, jerseyNumber: 98, team, status },

    // UNSPECIFIED (25)
    { fullName: 'Anik', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Jibon', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Mainuddin', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Mainul', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Masum', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Nayan Sheikh', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Obaidullah', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Sabbir', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Sk Muhammed', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Sm Asif', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Tarequl Islam Mahim', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Khaled Hossain Sajib', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Masud Islam Sabuj', playingRole: 'Unspecified' as const, jerseyNumber: 75, team, status },
    { fullName: 'Md Asif', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Mohammad Faisal', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Monir', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Mueen Uddin Abed', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Nayan Das', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Oronno Dipto', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Raihan', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Rakib', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Riaz', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Sabbir Hossain', playingRole: 'Unspecified' as const, team, status },
    { fullName: 'Saddam Hossen', playingRole: 'Unspecified' as const, jerseyNumber: 0, team, status },
    { fullName: 'Sajjad Shakib', playingRole: 'Unspecified' as const, team, status },
  ];
}
