import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '../animations/framerVariants';
import { useBlogPosts } from '../hooks/useBlogPosts';

const BlogPage = () => {
  const { posts: blogPosts, loading, error } = useBlogPosts();

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
            <div className="blog-grid">
              {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="blog-card-link">
                <motion.article
                  className="blog-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: post.id * 0.1 }}
                  whileHover={{ y: -6 }}
                >
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
                </motion.article>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
