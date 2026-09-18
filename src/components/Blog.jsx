import React, { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { reveal as fadeInUp, stagger } from '../animations/variants';

const staggerContainer = stagger(0.08);
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

const Blog = () => {
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

  // Home page skips the section until there are posts to show.
  if (!loading && (error || blogPosts.length === 0)) return null;

  return (
    <section className="blog-section section" id="blog">
      <div className="container">
        <m.div
          className="blog-content"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          {/* Section Header */}
          <m.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Blog</h2>
            <p className="section-subtitle">
              Thoughts on robotics, engineering, mentorship, and building things that matter
            </p>
          </m.div>

          {/* Category Filters */}
          {!loading && !error && blogPosts.length > 0 && (
            <m.div 
              className="blog-filters"
              variants={fadeInUp}
            >
              {categories.map((category) => (
                <m.button
                  key={category}
                  className={`blog-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </m.button>
              ))}
            </m.div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              Loading blog posts...
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && displayedPosts.length > 0 && (
            <m.div 
              className="blog-grid"
              variants={staggerContainer}
            >
              {displayedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </m.div>
          )}

          {/* No Posts in Category */}
          {!loading && !error && blogPosts.length > 0 && displayedPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No posts found in the "{selectedCategory}" category.
            </div>
          )}

          {/* View All Link */}
          {!loading && !error && blogPosts.length > 6 && (
            <m.div 
              style={{ textAlign: 'center', marginTop: '3rem' }}
              variants={fadeInUp}
            >
              <Link to="/blog" className="btn btn-primary">
                View All Posts →
              </Link>
            </m.div>
          )}
        </m.div>
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
      <m.article
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
      </m.article>
    </Link>
  );
};

export default Blog;
