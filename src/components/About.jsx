import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../animations/framerVariants';
import { useFirebaseImage } from '../hooks/useFirebaseImage';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const profileImageRef = useRef(null);
  const textRefs = useRef([]);
  const techStackRefs = useRef([]);
  
  // Load profile image from Firebase Storage
  // Note: profile-photo.jpg is currently in images/projects/ folder
  const { imageUrl: profileImageUrl, loading: profileImageLoading } = useFirebaseImage(
    "images/projects/profile-photo.jpg", // Firebase Storage path
    "/src/assets/images/profile-photo.jpg" // Fallback to local path
  );

  useEffect(() => {
    // Profile image animation
    if (profileImageRef.current) {
      gsap.fromTo(profileImageRef.current, 
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: profileImageRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Text animations
    textRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Tech stack cards animation
    techStackRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: ref,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
  }, []);

  const techStacks = [
    {
      title: 'Robotics & Engineering',
      items: ['Mechanical design & CAD workflows', 'FIRST Tech Challenge / VEX systems', 'Rapid prototyping & fabrication', 'Control systems & sensors']
    },
    {
      title: 'Software & Automation',
      items: ['Python · Java · C# · JavaScript', 'Embedded & robotics programming', 'Flutter + web experiences', 'Automation scripts & tooling']
    },
    {
      title: 'Design & Storytelling',
      items: ['Fusion 360 · SolidWorks · Blender', 'Visual design with Photoshop', 'UI/UX for STEM projects', 'Technical documentation & mentoring']
    }
  ];

  const achievements = [
    { number: '12+', label: 'Years Robotics Experience' },
  { number: '200+', label: 'Students Mentored' },
  { number: '100%', label: 'Innovation Focus' },
  { number: 'Robotics and Chess', label: 'National and International Awards' },
  { number: 'Captain', label: 'FTC Jamaica Inspire Award–Winning Team' },
  { number: '50+', label: 'Community Outreach Projects' },
  { number: 'Top 1%', label: 'National STEM Competitions' },
  { number: 'Multiple', label: 'Regional Design & Engineering Awards' },
  { number: 'Leader', label: 'STEM Mentorship and Innovation Programs' }
  ];

  return (
    <section ref={sectionRef} className="about-section section" id="about">
      <div className="container">
        <motion.div
          className="about-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">
              Engineering student passionate about robotics, innovation, and mentorship
            </p>
          </motion.div>

          <div className="about-grid">
            {/* Profile Image */}
            <motion.div 
              className="about-image-container"
              variants={fadeInLeft}
            >
              <div className="profile-image-wrapper">
                {profileImageLoading ? (
                  <div className="profile-image-loading">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <motion.img
                    ref={profileImageRef}
                    src={profileImageUrl || "/src/assets/images/profile-photo.jpg"}
                    alt="Rithvik Gogineni - Robotics Innovator and STEM Leader"
                    className="profile-image"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      // Fallback if Firebase image fails to load
                      e.target.src = "/src/assets/images/profile-photo.jpg";
                    }}
                  />
                )}
                <div className="profile-image-bg"></div>
                <div className="profile-image-glow"></div>
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div 
              className="about-text"
              variants={fadeInRight}
            >
              <motion.p 
                ref={el => textRefs.current[0] = el}
                className="about-description"
              >
                I’m an engineering student and lifelong robotics enthusiast from Kingston, Jamaica, driven by a passion for innovation, mentorship, and purposeful design. With over 12 years of experience in competitive robotics, I currently serve as the Vice-Captain of Jamaica’s National Inspire Award–winning FTC team, where I lead initiatives that merge creativity, engineering, and teamwork to push the boundaries of what’s possible.
              </motion.p>

              <motion.p 
                ref={el => textRefs.current[1] = el}
                className="about-description"
              >
                Beyond competition, I’m deeply committed to empowering the next generation of innovators. I mentor students across local schools, guiding them in mechanical design, coding, and problem-solving — helping them discover the same excitement for STEM that shaped my own journey.

At my core, I’m an engineer who loves to build — not just machines, but ideas, teams, and communities. Whether designing complex mechanisms, writing code, or exploring emerging technologies, I’m always seeking new ways to learn, improve, and make an impact.

              </motion.p>

              <motion.div 
                ref={el => textRefs.current[2] = el}
                className="about-highlights"
              >
                <div className="highlight-item">
                  <div className="highlight-icon">🎯</div>
                  <div className="highlight-text">
                    <h4>Engineering Innovator</h4>
                    <p>I love tackling complex challenges and finding elegant solutions</p>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">🚀</div>
                  <div className="highlight-text">
                    <h4>Lifelong Builder</h4>
                    <p>Always exploring new technologies and improving my skills</p>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">🤝</div>
                  <div className="highlight-text">
                    <h4>Collaborative Leader</h4>
                    <p>Collaborative approach with strong communication skills</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Skills Section */}
          <motion.div 
            className="skills-section"
            variants={fadeInUp}
            // Removed any background color, border, or box shadow styles from skills-section
          >
            <h3 className="skills-title">Core Toolkit</h3>
            <p className="skills-caption">Focused on building resilient robotics systems with thoughtful software and design.</p>
            <div className="tech-stack-grid">
              {techStacks.map((stack, index) => (
                <motion.div
                  key={stack.title}
                  ref={el => techStackRefs.current[index] = el}
                  className="tech-stack-card"
                  transition={{ duration: 0.3 }}
                  // Removed any background color, border, or box shadow styles from tech-stack-card
                >
                  <h4>{stack.title}</h4>
                  <ul>
                    {stack.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div 
            className="achievements-grid"
            variants={staggerContainer}
          >
            {achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.label}
                className="achievement-item"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="achievement-number">{achievement.number}</div>
                <div className="achievement-label">{achievement.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
