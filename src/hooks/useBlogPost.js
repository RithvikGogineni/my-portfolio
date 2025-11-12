// React hook for loading a single blog post from Firestore
import { useState, useEffect } from 'react';
import { getBlogPost } from '../utils/firestore';

/**
 * Hook to load a single blog post from Firestore
 * @param {string} postId - Blog post ID
 * @returns {Object} { post, loading, error }
 */
export const useBlogPost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);
        const blogPost = await getBlogPost(postId);
        setPost(blogPost);
        setError(null);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  return { post, loading, error };
};

