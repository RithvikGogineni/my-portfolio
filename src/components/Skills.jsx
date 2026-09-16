import React, { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FaRobot, FaCog, FaWrench, FaTrophy, FaBolt,
  FaCode, FaPython, FaJava, FaPalette, FaTheaterMasks, FaImage, FaCube, FaGem, FaBullseye, FaStar,
  FaChess, FaGraduationCap, FaRaspberryPi, FaMicrochip, FaBrain, FaDatabase, FaPrint, FaReact, FaVial
} from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiRos, SiVercel } from 'react-icons/si';
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
      title: "Robotics & Hardware",
      icon: FaRobot,
      skills: [
        { name: "ROS", level: 85, icon: SiRos },
        { name: "Raspberry Pi", level: 88, icon: FaRaspberryPi },
        { name: "Arduino", level: 85, icon: FaMicrochip },
        { name: "REV Robotics", level: 95, icon: FaTrophy },
        { name: "3D Printing", level: 90, icon: FaPrint },
        { name: "Mechanical Design", level: 90, icon: FaBolt }
      ]
    },
    {
      title: "CAD & Programming",
      icon: FaCode,
      skills: [
        { name: "Fusion 360", level: 92, icon: FaCog },
        { name: "Onshape", level: 85, icon: FaWrench },
        { name: "Python", level: 90, icon: FaPython },
        { name: "TypeScript", level: 88, icon: SiTypescript },
        { name: "Java", level: 85, icon: FaJava },
        { name: "SQL", level: 80, icon: FaDatabase }
      ]
    },
    {
      title: "Software & AI",
      icon: FaBrain,
      skills: [
        { name: "React Native", level: 85, icon: FaReact },
        { name: "Supabase", level: 85, icon: SiSupabase },
        { name: "PostgreSQL", level: 80, icon: SiPostgresql },
        { name: "LLM Agents", level: 88, icon: FaBrain },
        { name: "Playwright", level: 78, icon: FaVial },
        { name: "Vercel & Git", level: 88, icon: SiVercel }
      ]
    },
    {
      title: "Design & Creativity",
      icon: FaPalette,
      skills: [
        { name: "Blender", level: 80, icon: FaTheaterMasks },
        { name: "Photoshop", level: 85, icon: FaImage },
        { name: "3D Modeling", level: 88, icon: FaCube },
        { name: "Web Design", level: 82, icon: FaGem },
        { name: "Branding", level: 78, icon: FaBullseye },
        { name: "UI/UX", level: 75, icon: FaStar }
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
        <m.div
          className="skills-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <m.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-subtitle">
              Technical skills and soft skills that drive my success
            </p>
          </m.div>

          {/* Technical Skills */}
          <div className="technical-skills">
            {skillCategories.map((category, categoryIndex) => (
              <m.div
                key={category.title}
                ref={el => skillCardsRef.current[categoryIndex] = el}
                className="skill-category-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="category-header">
                  <m.div
                    ref={el => skillIconsRef.current[categoryIndex] = el}
                    className="category-icon"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    {category.icon && React.createElement(category.icon)}
                  </m.div>
                  <h3 className="category-title">{category.title}</h3>
                </div>

                <div className="skills-grid">
                  {category.skills.map((skill, skillIndex) => (
                    <m.div
                      key={skill.name}
                      className="skill-item"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="skill-header">
                        <div className="skill-icon">
                          {skill.icon && React.createElement(skill.icon)}
                        </div>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      
                      <div className="progress-container">
                        <div className="progress-bar">
                          <m.div
                            ref={el => progressBarsRef.current[categoryIndex * 6 + skillIndex] = el}
                            className="progress-fill"
                            data-width={`${skill.level}%`}
                            variants={progressVariants}
                          ></m.div>
                        </div>
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>
            ))}
          </div>

          {/* Soft Skills */}
          <m.div 
            className="soft-skills"
            variants={fadeInUp}
          >
            <h3 className="soft-skills-title">Soft Skills</h3>
            <div className="soft-skills-grid">
              {softSkills.map((skill, index) => (
                <m.div
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
                    <m.div
                      className="soft-skill-bar"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    ></m.div>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* Certifications */}
          <m.div 
            className="certifications"
            variants={fadeInUp}
          >
            <h3 className="certifications-title">Certifications</h3>
            <div className="certifications-grid">
              <m.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon"><FaTrophy /></div>
                <div className="cert-content">
                  <h4>FTC National Inspire Award</h4>
                  <p>FIRST Tech Challenge</p>
                  <span className="cert-date">2025</span>
                </div>
              </m.div>
              
              <m.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon"><FaGraduationCap /></div>
                <div className="cert-content">
                  <h4>Grade 2 Piano Distinction</h4>
                  <p>ABRSM UK</p>
                  <span className="cert-date">2023</span>
                </div>
              </m.div>
              
              <m.div
                className="certification-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cert-icon"><FaChess /></div>
                <div className="cert-content">
                  <h4>Chess U1800 Champion</h4>
                  <p>St. Andrew Parish</p>
                  <span className="cert-date">2022</span>
                </div>
              </m.div>
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
};

export default Skills;
