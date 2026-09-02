import { auth, db } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

  return userCredential;
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};
