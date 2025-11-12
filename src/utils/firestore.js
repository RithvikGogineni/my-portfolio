// Firestore utilities for blog posts
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  limit,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get all blog posts from Firestore
 * @returns {Promise<Array>} Array of blog posts
 */
export const getBlogPosts = async () => {
  try {
    const blogsRef = collection(db, 'blogPosts');
    const q = query(blogsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

/**
 * Get a single blog post by ID
 * @param {string} postId - Blog post ID
 * @returns {Promise<Object|null>} Blog post data or null
 */
export const getBlogPost = async (postId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      return {
        id: postSnap.id,
        ...postSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

/**
 * Get blog posts with caching
 */
export const getCachedBlogPosts = async () => {
  const cacheKey = 'firebase_blog_posts';
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { posts, timestamp } = JSON.parse(cached);
      // Cache valid for 1 hour
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return posts;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }
  
  // Fetch from Firestore
  const posts = await getBlogPosts();
  
  if (posts.length > 0) {
    // Cache the posts
    localStorage.setItem(cacheKey, JSON.stringify({
      posts,
      timestamp: Date.now()
    }));
  }
  
  return posts;
};

