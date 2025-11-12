// Firestore utilities for gallery sections and images
import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get all gallery sections from Firestore
 * Each section represents a folder in images/gallery/
 * @returns {Promise<Array>} Array of gallery sections with their images
 */
export const getGallerySections = async () => {
  try {
    // Check if Firebase is initialized
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }
    
    const sectionsRef = collection(db, 'gallerySections');
    const q = query(sectionsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sections = [];
    querySnapshot.forEach((doc) => {
      sections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sections;
  } catch (error) {
    console.error('Error fetching gallery sections:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Get images for a specific gallery section
 * @param {string} sectionId - Section ID (folder name, also document ID)
 * @returns {Promise<Array>} Array of image filenames
 */
export const getSectionImages = async (sectionId) => {
  try {
    const sectionRef = doc(db, 'gallerySections', sectionId);
    const sectionSnap = await getDoc(sectionRef);
    
    if (sectionSnap.exists()) {
      const sectionData = sectionSnap.data();
      return sectionData.images || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching section images:', error);
    return [];
  }
};

/**
 * Get gallery sections with caching
 */
export const getCachedGallerySections = async () => {
  const cacheKey = 'firebase_gallery_sections';
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { sections, timestamp } = JSON.parse(cached);
      // Cache valid for 1 hour
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return sections;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }
  
  // Fetch from Firestore
  const sections = await getGallerySections();
  
  if (sections.length > 0) {
    // Cache the sections
    localStorage.setItem(cacheKey, JSON.stringify({
      sections,
      timestamp: Date.now()
    }));
  }
  
  return sections;
};

