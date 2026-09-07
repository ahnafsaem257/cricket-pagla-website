import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Notice } from '../../types';

export const getNotices = async (): Promise<Notice[]> => {
  const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), noticeId: doc.id } as Notice));
};

export const getPublishedNotices = async (): Promise<Notice[]> => {
  const q = query(collection(db, 'notices'), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ ...doc.data(), noticeId: doc.id } as Notice))
    .filter(n => n.status === 'published');
};

export const getNoticeById = async (noticeId: string): Promise<Notice | null> => {
  const docRef = doc(db, 'notices', noticeId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), noticeId: docSnap.id } as Notice;
  }
  return null;
};

export const createNotice = async (
  noticeData: Omit<Notice, 'noticeId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const newNoticeRef = doc(collection(db, 'notices'));

  const notice: Notice = {
    ...noticeData,
    noticeId: newNoticeRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newNoticeRef, notice);
  return newNoticeRef.id;
};

export const updateNotice = async (
  noticeId: string,
  updates: Partial<Notice>
): Promise<void> => {
  const docRef = doc(db, 'notices', noticeId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteNotice = async (noticeId: string): Promise<void> => {
  const docRef = doc(db, 'notices', noticeId);
  await deleteDoc(docRef);
};