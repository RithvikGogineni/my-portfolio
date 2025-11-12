// React hook for loading gallery sections from Firestore
import { useState, useEffect } from 'react';
import { getCachedGallerySections } from '../utils/galleryFirestore';

/**
 * Hook to load gallery sections from Firestore
 * @returns {Object} { sections, loading, error }
 */
export const useGallerySections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoading(true);
        const gallerySections = await getCachedGallerySections();
        setSections(gallerySections);
        setError(null);
      } catch (err) {
        console.error('Error loading gallery sections:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  return { sections, loading, error };
};

