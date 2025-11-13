import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

          <div className="blog-post-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for markdown elements
                h2: ({node, ...props}) => <h2 className="blog-markdown-h2" {...props} />,
                h3: ({node, ...props}) => <h3 className="blog-markdown-h3" {...props} />,
                p: ({node, ...props}) => <p className="blog-markdown-p" {...props} />,
                ul: ({node, ...props}) => <ul className="blog-markdown-ul" {...props} />,
                ol: ({node, ...props}) => <ol className="blog-markdown-ol" {...props} />,
                li: ({node, ...props}) => <li className="blog-markdown-li" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="blog-markdown-code-inline" {...props} />
                  ) : (
                    <code className="blog-markdown-code-block" {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="blog-markdown-pre" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="blog-markdown-blockquote" {...props} />,
                a: ({node, ...props}) => <a className="blog-markdown-link" target="_blank" rel="noopener noreferrer" {...props} />,
                img: ({node, ...props}) => <img className="blog-markdown-img" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </motion.article>
    </main>
  );
};

export default BlogPostPage;
