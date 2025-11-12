// Firebase Storage utilities for images
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Get download URL for an image from Firebase Storage
 * @param {string} imagePath - Path to image in Firebase Storage (e.g., 'images/projects/fgc-robot.png')
 * @returns {Promise<string>} Download URL
 */
export const getImageUrl = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    // Fallback to placeholder or local path
    return null;
  }
};

/**
 * Get multiple image URLs
 * @param {string[]} imagePaths - Array of image paths
 * @returns {Promise<Object>} Object with image paths as keys and URLs as values
 */
export const getImageUrls = async (imagePaths) => {
  const urlPromises = imagePaths.map(async (path) => {
    const url = await getImageUrl(path);
    return { path, url };
  });
  
  const results = await Promise.all(urlPromises);
  return results.reduce((acc, { path, url }) => {
    acc[path] = url;
    return acc;
  }, {});
};

/**
 * Get image URL with caching
 * Uses localStorage to cache URLs
 */
export const getCachedImageUrl = async (imagePath) => {
  const cacheKey = `firebase_image_${imagePath}`;
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { url, timestamp } = JSON.parse(cached);
      // Cache valid for 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return url;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }
  
  // Fetch from Firebase
  const url = await getImageUrl(imagePath);
  
  if (url) {
    // Cache the URL
    localStorage.setItem(cacheKey, JSON.stringify({
      url,
      timestamp: Date.now()
    }));
  }
  
  return url;
};

