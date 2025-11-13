// React hook for loading blog posts from Firestore
import { useState, useEffect, useCallback } from 'react';
import { getCachedBlogPosts, clearBlogPostsCache } from '../utils/firestore';

/**
 * Hook to load blog posts from Firestore
 * @returns {Object} { posts, loading, error, refresh }
 */
export const useBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const blogPosts = await getCachedBlogPosts(forceRefresh);
      setPosts(blogPosts);
      setError(null);
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const refresh = useCallback(() => {
    loadPosts(true);
  }, [loadPosts]);

  return { posts, loading, error, refresh };
};

