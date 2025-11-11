import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/framerVariants';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogPosts = {
    1: {
      title: "Building Award-Winning Robots: Lessons from FTC Worlds 2025",
      date: "March 2025",
      category: "Robotics",
      readTime: "8 min read",
      content: `
        <p>Winning the National Inspire Award and Judge's Choice (Ochoa) Award at FTC Worlds 2025 wasn't just about building a great robot—it was about understanding the entire ecosystem of competitive robotics.</p>
        
        <h2>The Design Philosophy</h2>
        <p>Our approach centered on three core principles: reliability, adaptability, and storytelling. Every mechanical decision, every line of code, was evaluated against these criteria.</p>
        
        <h2>Team Dynamics</h2>
        <p>Leading a team of passionate engineers requires more than technical expertise. It demands clear communication, shared vision, and the ability to turn individual strengths into collective power.</p>
        
        <h2>Technical Highlights</h2>
        <p>The flywheel shooter system required precise calculations for projectile trajectory, accounting for variables like launch angle, wheel speed, and target distance. We developed custom algorithms that could adapt in real-time during matches.</p>
        
        <h2>Lessons Learned</h2>
        <p>Competition robotics teaches you that failure is just data. Every match, every iteration, every breakdown is information that makes the next version better. This mindset extends far beyond the competition field.</p>
      `
    },
    2: {
      title: "Mentoring the Next Generation of STEM Leaders",
      date: "February 2025",
      category: "Education",
      readTime: "6 min read",
      content: `
        <p>Teaching robotics to primary students at Halls of Learning and Vaz Prep has fundamentally changed how I think about engineering education.</p>
        
        <h2>Starting Early</h2>
        <p>Introducing STEM concepts to young minds isn't about complexity—it's about wonder. When a 10-year-old sees their first robot move based on code they wrote, something clicks that stays with them forever.</p>
        
        <h2>Building Confidence</h2>
        <p>Many students come in thinking they're "not good at math" or "not technical." My job is to show them that engineering is just problem-solving with tools. Once they realize that, barriers disappear.</p>
        
        <h2>The Impact</h2>
        <p>Seeing students who started unsure of themselves become team leaders, seeing them present their projects with confidence, that's what makes mentorship worthwhile.</p>
      `
    },
    3: {
      title: "From CAD to Competition: The Engineering Workflow",
      date: "January 2025",
      category: "Engineering",
      readTime: "10 min read",
      content: `
        <p>My design process has evolved over 12 years of building robots. Here's how I go from concept to competition-ready machine.</p>
        
        <h2>Phase 1: Problem Definition</h2>
        <p>Before opening Fusion 360, I spend time understanding the challenge. What are the constraints? What's the scoring system? What strategies are competitors likely to use?</p>
        
        <h2>Phase 2: Rapid Prototyping</h2>
        <p>I start with rough sketches, then move to CAD. The first version is never the final version. I build, test, iterate. Sometimes the best solution comes from the third or fourth attempt.</p>
        
        <h2>Phase 3: Testing & Refinement</h2>
        <p>Real-world testing reveals things CAD can't. Friction, wear, unexpected interactions. This phase is where good designs become great ones.</p>
        
        <h2>Phase 4: Documentation</h2>
        <p>Good engineering is reproducible. I document everything—design decisions, calculations, test results. This helps the team and future builds.</p>
      `
    },
    4: {
      title: "Balancing Leadership, Learning, and Innovation",
      date: "December 2024",
      category: "Leadership",
      readTime: "7 min read",
      content: `
        <p>Juggling roles as Vice-Captain of FTC Jamaica, Robotics Club President, student, mentor, and freelancer requires intentional time management and clear priorities.</p>
        
        <h2>Setting Boundaries</h2>
        <p>I've learned that saying "no" to good opportunities is sometimes necessary to say "yes" to great ones. Focus beats busyness every time.</p>
        
        <h2>Energy Management</h2>
        <p>Not all work is created equal. I schedule deep work for robotics and coding during my peak hours, and use lighter tasks for times when my energy is lower.</p>
        
        <h2>Building Systems</h2>
        <p>Leadership isn't about doing everything yourself—it's about building systems that allow others to contribute effectively. Good processes scale better than individual effort.</p>
        
        <h2>The Long View</h2>
        <p>Every commitment is a trade-off. I choose projects and roles that align with my long-term goals: building impactful technology and developing the next generation of engineers.</p>
      `
    }
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <main className="main-content">
        <div className="container">
          <h1>Post not found</h1>
          <button onClick={() => navigate('/blog')}>Back to Blog</button>
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
