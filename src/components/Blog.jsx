import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, cardVariants } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Blog = () => {
  const sectionRef = useRef(null);
  const blogCardsRef = useRef([]);

  useEffect(() => {
    // Blog cards animation
    blogCardsRef.current.forEach((card, index) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Already in view, animate immediately
          gsap.set(card, { y: 50, opacity: 0 });
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            delay: index * 0.1
          });
        } else {
          // Not in view, use ScrollTrigger
          gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              delay: index * 0.1,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }
    });
  }, []);

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

          {/* Blog Grid */}
          <motion.div 
            className="blog-grid"
            variants={staggerContainer}
          >
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                ref={el => blogCardsRef.current[index] = el}
                className="blog-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="blog-card-header">
                  <span className="blog-category">{post.category}</span>
                  <span className="blog-date">{post.date}</span>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <div className="blog-card-footer">
                  <span className="blog-read-time">{post.readTime}</span>
                  <motion.a
                    href="#"
                    className="blog-read-more"
                    whileHover={{ x: 6 }}
                  >
                    Read more →
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
