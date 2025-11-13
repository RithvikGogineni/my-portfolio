import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

gsap.registerPlugin(ScrollTrigger);

const Blog = () => {
  const sectionRef = useRef(null);
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

  // Limit to 6 posts on home page
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, 6);
  }, [filteredPosts]);

  return (
    <section ref={sectionRef} className="blog-section section" id="blog">
      <div className="container">
        <motion.div
          className="blog-content"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Blog</h2>
            <p className="section-subtitle">
              Thoughts on robotics, engineering, mentorship, and building things that matter
            </p>
          </motion.div>

          {/* Category Filters */}
          {!loading && !error && blogPosts.length > 0 && (
            <motion.div 
              className="blog-filters"
              variants={fadeInUp}
            >
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
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              Loading blog posts...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-accent-primary)' }}>
              Error loading blog posts. Please try again later.
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No blog posts yet. Check back soon!
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && displayedPosts.length > 0 && (
            <motion.div 
              className="blog-grid"
              variants={staggerContainer}
            >
              {displayedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}

          {/* No Posts in Category */}
          {!loading && !error && displayedPosts.length === 0 && filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No posts found in the "{selectedCategory}" category.
            </div>
          )}

          {/* View All Link */}
          {!loading && !error && blogPosts.length > 6 && (
            <motion.div 
              style={{ textAlign: 'center', marginTop: '3rem' }}
              variants={fadeInUp}
            >
              <Link to="/blog" className="btn btn-primary">
                View All Posts →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Blog Card Component with Cover Image (same as BlogPage)
const BlogCard = ({ post }) => {
  const { imageUrl: coverImageUrl, loading: imageLoading } = useFirebaseImage(
    post.coverImage || null,
    null
  );

  return (
    <Link to={`/blog/${post.id}`} className="blog-card-link">
      <motion.article
        className="blog-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
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

export default Blog;
