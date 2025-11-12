// React hook for loading images from Firebase Storage
import { useState, useEffect } from 'react';
import { getCachedImageUrl } from '../utils/firebaseStorage';

/**
 * Hook to load an image URL from Firebase Storage
 * @param {string} imagePath - Firebase Storage path (e.g., 'images/projects/fgc-robot.png')
 * @param {string} fallback - Fallback image path (local or placeholder)
 * @returns {string} Image URL
 */
export const useFirebaseImage = (imagePath, fallback = null) => {
  const [imageUrl, setImageUrl] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imagePath) {
      setLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        setLoading(true);
        const url = await getCachedImageUrl(imagePath);
        if (url) {
          setImageUrl(url);
        } else if (fallback) {
          setImageUrl(fallback);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(err);
        if (fallback) {
          setImageUrl(fallback);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imagePath, fallback]);

  return { imageUrl, loading, error };
};

