import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, iconVariants, progressVariants } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const skillIconsRef = useRef([]);
  const progressBarsRef = useRef([]);
  const skillCardsRef = useRef([]);

  useEffect(() => {
    // Skill icons animation
    skillIconsRef.current.forEach((icon, index) => {
      if (icon) {
        gsap.fromTo(icon,
          { scale: 0, rotation: -180, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover effects
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });

        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });
      }
    });

    // Progress bars animation
    progressBarsRef.current.forEach((bar, index) => {
      if (bar) {
        gsap.fromTo(bar,
          { width: "0%" },
          {
            width: bar.dataset.width || "100%",
            duration: 2,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.2,
            scrollTrigger: {
              trigger: bar,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Skill cards animation
    skillCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, []);

  const skillCategories = [
    {
      title: "Robotics & Engineering",
      icon: "🤖",
      skills: [
        { name: "CAD Design", level: 95, icon: "📐" },
        { name: "Fusion 360", level: 90, icon: "⚙️" },
        { name: "SolidWorks", level: 85, icon: "🔧" },
        { name: "VEX Systems", level: 90, icon: "🎮" },
        { name: "FTC Systems", level: 95, icon: "🏆" },
        { name: "Mechanical Design", level: 88, icon: "⚡" }
      ]
    },
    {
      title: "Programming",
      icon: "💻",
      skills: [
        { name: "Python", level: 90, icon: "🐍" },
        { name: "Java", level: 85, icon: "☕" },
        { name: "JavaScript", level: 80, icon: "🟨" },
        { name: "C#", level: 88, icon: "🔷" },
        { name: "Flutter", level: 75, icon: "📱" },
        { name: "HTML & CSS", level: 85, icon: "🌐" }
      ]
    },
    {
      title: "Design & Creativity",
      icon: "🎨",
      skills: [
        { name: "Blender", level: 80, icon: "🎭" },
        { name: "Photoshop", level: 85, icon: "🖼️" },
        { name: "3D Modeling", level: 88, icon: "📦" },
        { name: "Web Design", level: 82, icon: "💎" },
        { name: "Branding", level: 78, icon: "🎯" },
        { name: "UI/UX", level: 75, icon: "✨" }
      ]
    }
  ];

  const softSkills = [
    { name: "Leadership", level: 95 },
    { name: "Collaboration", level: 90 },
    { name: "Problem-Solving", level: 88 },
    { name: "Time Management", level: 85 },
    { name: "Public Speaking", level: 80 },
    { name: "Adaptability", level: 92 }
  ];

  return (
    <section ref={sectionRef} className="skills-section section" id="skills">
      <div className="container">
        <motion.div
          className="skills-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-subtitle">
              Technical skills and soft skills that drive my success
            </p>
          </motion.div>

          {/* Technical Skills */}
          <div className="technical-skills">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                ref={el => skillCardsRef.current[categoryIndex] = el}
                className="skill-category-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="category-header">
                  <motion.div
                    ref={el => skillIconsRef.current[categoryIndex] = el}
                    className="category-icon"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="category-title">{category.title}</h3>
                </div>

                <div className="skills-grid">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="skill-item"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="skill-header">
                        <div className="skill-icon">{skill.icon}</div>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      
                      <div className="progress-container">
                        <div className="progress-bar">
                          <motion.div
                            ref={el => progressBarsRef.current[categoryIndex * 6 + skillIndex] = el}
                            className="progress-fill"
                            data-width={`${skill.level}%`}
                            variants={progressVariants}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Soft Skills */}
          <motion.div 
            className="soft-skills"
            variants={fadeInUp}
          >
            <h3 className="soft-skills-title">Soft Skills</h3>
            <div className="soft-skills-grid">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="soft-skill-item"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="soft-skill-header">
                    <span className="soft-skill-name">{skill.name}</span>
                    <span className="soft-skill-level">{skill.level}%</span>
                  </div>
                  
                  <div className="soft-skill-progress">
                    <motion.div
                      className="soft-skill-bar"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div 
            className="certifications"
            variants={fadeInUp}
          >
            <h3 className="certifications-title">Certifications</h3>
            <div className="certifications-grid">
              <motion.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon">🏆</div>
                <div className="cert-content">
                  <h4>FTC National Inspire Award</h4>
                  <p>FIRST Tech Challenge</p>
                  <span className="cert-date">2025</span>
                </div>
              </motion.div>
              
              <motion.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon">🎓</div>
                <div className="cert-content">
                  <h4>Grade 2 Piano Distinction</h4>
                  <p>ABRSM UK</p>
                  <span className="cert-date">2023</span>
                </div>
              </motion.div>
              
              <motion.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon">♟️</div>
                <div className="cert-content">
                  <h4>Chess U1800 Champion</h4>
                  <p>St. Andrew Parish</p>
                  <span className="cert-date">2022</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
