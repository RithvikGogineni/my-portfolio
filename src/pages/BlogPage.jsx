import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '../animations/framerVariants';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

const BlogPage = () => {
  const { posts: blogPosts, loading, error } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from posts (auto-updates based on Firestore)
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    blogPosts.forEach(post => {
      if (post.category) {
        uniqueCategories.add(post.category);
      }
    });
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [blogPosts]);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogPosts;
    }
    return blogPosts.filter(post => post.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  return (
    <main className="main-content">
      <motion.div
        className="page-hero"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">
            Thoughts on robotics, engineering, mentorship, and building things that matter
          </p>
        </div>
      </motion.div>

      <section className="section">
        <div className="container">
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              Loading blog posts...
            </div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-accent-primary)' }}>
              Error loading blog posts. Please try again later.
            </div>
          )}
          {!loading && !error && blogPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No blog posts yet. Check back soon!
            </div>
          )}
          {!loading && !error && blogPosts.length > 0 && (
            <>
              {/* Category Filters */}
              <div className="blog-filters">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    className={`blog-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Blog Grid */}
              {filteredPosts.length > 0 ? (
                <div className="blog-grid">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No posts found in the "{selectedCategory}" category.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

// Blog Card Component with Cover Image
const BlogCard = ({ post }) => {
  const { imageUrl: coverImageUrl, loading: imageLoading, error: imageError } = useFirebaseImage(
    post.coverImage || null,
    null
  );

  // Debug logging
  useEffect(() => {
    if (post.coverImage) {
      console.log('Blog post cover image:', {
        postId: post.id,
        title: post.title,
        coverImagePath: post.coverImage,
        imageUrl: coverImageUrl,
        loading: imageLoading,
        error: imageError
      });
    } else {
      console.log('Blog post has no coverImage:', {
        postId: post.id,
        title: post.title,
        postFields: Object.keys(post)
      });
    }
  }, [post.coverImage, coverImageUrl, imageLoading, imageError, post.id, post.title]);

  return (
    <Link to={`/blog/${post.id}`} className="blog-card-link">
      <motion.article
        className="blog-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: post.id * 0.1 }}
        whileHover={{ y: -6 }}
      >
        {post.coverImage && (
          <div className="blog-card-image-container">
            {imageLoading ? (
              <div className="blog-image-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : coverImageUrl ? (
              <img 
                src={coverImageUrl} 
                alt={post.title}
                className="blog-card-image"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load cover image:', post.coverImage, e);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="blog-image-loading" style={{ color: 'var(--color-text-muted)' }}>
                Image not found
              </div>
            )}
          </div>
        )}
        
        <div className="blog-card-content">
          <div className="blog-card-header">
            <span className="blog-category">{post.category}</span>
            <span className="blog-date">{post.date}</span>
          </div>
          
          <h3 className="blog-title">{post.title}</h3>
          <p className="blog-excerpt">{post.excerpt}</p>
          
          <div className="blog-card-footer">
            <span className="blog-read-time">{post.readTime}</span>
            <span className="blog-read-more">Read more →</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default BlogPage;
