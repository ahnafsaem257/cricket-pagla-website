import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { GalleryImage } from '../../types';

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), imageId: doc.id } as GalleryImage));
};

export const getPublishedGalleryImages = async (): Promise<GalleryImage[]> => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ ...doc.data(), imageId: doc.id } as GalleryImage))
    .filter(img => img.published);
};

export const createGalleryImage = async (
  imageData: Omit<GalleryImage, 'imageId' | 'createdAt'>
): Promise<string> => {
  const newImageRef = doc(collection(db, 'gallery'));

  const galleryImage: GalleryImage = {
    ...imageData,
    imageId: newImageRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(newImageRef, galleryImage);
  return newImageRef.id;
};

export const updateGalleryImage = async (
  imageId: string,
  updates: Partial<GalleryImage>
): Promise<void> => {
  const docRef = doc(db, 'gallery', imageId);
  await updateDoc(docRef, updates);
};

export const deleteGalleryImage = async (imageId: string): Promise<void> => {
  const docRef = doc(db, 'gallery', imageId);
  await deleteDoc(docRef);
};