import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp } from '../animations/framerVariants';
import Blog from '../components/Blog';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Building Award-Winning Robots: Lessons from FTC Worlds 2025",
      excerpt: "Reflecting on the design process, team dynamics, and technical challenges that led to winning the National Inspire Award and Judge's Choice at FTC Worlds.",
      date: "March 2025",
      category: "Robotics",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Mentoring the Next Generation of STEM Leaders",
      excerpt: "How teaching robotics to primary students has shaped my approach to engineering education and community impact in Jamaica.",
      date: "February 2025",
      category: "Education",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "From CAD to Competition: The Engineering Workflow",
      excerpt: "A deep dive into my design process—from initial concept sketches in Fusion 360 to final assembly and testing for competition robots.",
      date: "January 2025",
      category: "Engineering",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Balancing Leadership, Learning, and Innovation",
      excerpt: "Thoughts on managing multiple roles as Vice-Captain, student, mentor, and freelancer while maintaining focus on meaningful work.",
      date: "December 2024",
      category: "Leadership",
      readTime: "7 min read"
    }
  ];

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
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
