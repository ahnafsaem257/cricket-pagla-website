import { auth, db } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import type { User, UserRole, UserStatus } from '../../types';

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create user document in Firestore with default 'PLAYER' role
  const userData: User = {
    uid: user.uid,
    name,
    email,
    role: 'PLAYER' as UserRole, // Default role
    status: 'ACTIVE' as UserStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), userData);

  // Check if a player with this name already exists
  const normalizedName = name.trim().toLowerCase();
  const playersRef = collection(db, 'players');
  const q = query(playersRef);
  const snapshot = await getDocs(q);
  const match = snapshot.docs.find(d => {
    const data = d.data();
    return data.fullName?.trim().toLowerCase() === normalizedName && !data.userId;
  });

  if (match) {
    // Link existing player
    await updateDoc(doc(db, 'players', match.id), {
      userId: user.uid,
      updatedAt: new Date().toISOString()
    });
  } else {
    // Create new player
    const newPlayerRef = doc(playersRef);
    await setDoc(newPlayerRef, {
      playerId: newPlayerRef.id,
      userId: user.uid,
      fullName: name,
      playingRole: 'Unspecified',
      status: 'Active',
      team: 'Cricket Pagla',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return userCredential;
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};
