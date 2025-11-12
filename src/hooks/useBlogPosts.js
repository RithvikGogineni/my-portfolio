// React hook for loading blog posts from Firestore
import { useState, useEffect } from 'react';
import { getCachedBlogPosts } from '../utils/firestore';

/**
 * Hook to load blog posts from Firestore
 * @returns {Object} { posts, loading, error }
 */
export const useBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await getCachedBlogPosts();
        setPosts(blogPosts);
        setError(null);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return { posts, loading, error };
};

