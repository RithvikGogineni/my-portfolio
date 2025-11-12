import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';
import { useBlogPost } from '../hooks/useBlogPost';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(id);

  if (loading) {
    return (
      <main className="main-content">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            Loading post...
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="main-content">
        <div className="container">
          <h1>Post not found</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            {error ? 'Error loading post. Please try again later.' : 'The blog post you\'re looking for doesn\'t exist.'}
          </p>
          <button onClick={() => navigate('/blog')} className="btn btn-primary">Back to Blog</button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <motion.article
        className="blog-post-page"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="container">
          <motion.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -6 }}
          >
            ← Back to Blog
          </motion.button>

          <header className="blog-post-header">
            <span className="blog-post-category">{post.category}</span>
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </motion.article>
    </main>
  );
};

export default BlogPostPage;
