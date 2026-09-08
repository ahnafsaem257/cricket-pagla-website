import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User, UserRole, UserStatus } from '../../types';

export const getUsers = async (): Promise<User[]> => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as User);
};

export const getUserById = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
};

export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', role),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as User);
};

export const updateUserStatus = async (uid: string, status: UserStatus): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString()
  });
};

export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    role,
    updatedAt: new Date().toISOString()
  });
};

export const deleteUser = async (uid: string): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await deleteDoc(docRef);
};

export const createUserByAdmin = async (
  name: string,
  email: string,
  role: UserRole
): Promise<string> => {
  const newUserRef = doc(collection(db, 'users'));

  const userData: User = {
    uid: newUserRef.id,
    name,
    email,
    role,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newUserRef, userData);
  return newUserRef.id;
};
