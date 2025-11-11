import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, timelineVariants, timelineDotVariants, timelineLineVariants } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const experienceItemsRef = useRef([]);
  const timelineLineRef = useRef(null);
  const timelineDotsRef = useRef([]);

  useEffect(() => {
    // Timeline line animation
    if (timelineLineRef.current) {
      gsap.fromTo(timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94],
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Timeline dots animation
    timelineDotsRef.current.forEach((dot, index) => {
      if (dot) {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: dot,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Experience items animation
    experienceItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(item,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.2,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover effects
        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            scale: 1.02,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            scale: 1,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });
      }
    });
  }, []);

  const experiences = [
    {
      id: 1,
      title: "Vice-Captain",
      company: "FTC Jamaica",
      period: "2024 - 2025",
      description: "Led award-winning robotics team to National and Worlds recognition, winning Inspire Award and Judge's Choice (Ochoa) Award at FTC Worlds 2025.",
      technologies: ["FTC Systems", "Leadership", "Team Management", "Robotics"],
      type: "work"
    },
    {
      id: 2,
      title: "Robotics Club President",
      company: "Campion College",
      period: "2025 - 2026",
      description: "Directed team builds, workshops, and community STEM outreach programs. Organized robotics competitions and mentored younger students.",
      technologies: ["Leadership", "Mentorship", "STEM Education", "Event Planning"],
      type: "work"
    },
    {
      id: 3,
      title: "Aeronautics Club President",
      company: "Campion College",
      period: "2024 - 2026",
      description: "Managed model flight design projects and student engagement in aerospace engineering. Led workshops on aerodynamics and flight principles.",
      technologies: ["Aerospace", "Engineering", "Project Management", "Education"],
      type: "work"
    },
    {
      id: 4,
      title: "Robotics Teacher",
      company: "Halls of Learning & Vaz Prep",
      period: "2022 - 2026",
      description: "Taught STEM fundamentals to primary students, emphasizing problem-solving and teamwork. Developed curriculum for robotics education.",
      technologies: ["Teaching", "STEM Education", "Curriculum Development", "Mentorship"],
      type: "work"
    },
    {
      id: 5,
      title: "Freelance Developer & Designer",
      company: "Self-Employed",
      period: "2023 - 2026",
      description: "Built websites and brand identities for clients including MedRehab Professionals and Proper Constructions Ltd. Focused on modern UX and accessibility.",
      technologies: ["Web Development", "Brand Design", "Client Work", "UX/UI"],
      type: "work"
    },
    {
      id: 6,
      title: "High School Education",
      company: "Campion College",
      period: "Expected Graduation: 2026",
      description: "Pursuing CAPE qualifications in Mathematics, Physics, and Economics. SAT Score: 1460 (Math 760, English 700). Active in robotics and STEM programs.",
      technologies: ["Mathematics", "Physics", "Economics", "Academic Excellence"],
      type: "education"
    }
  ];

  return (
    <section ref={sectionRef} className="experience-section section" id="experience">
      <div className="container">
        <motion.div
          className="experience-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Experience & Education</h2>
            <p className="section-subtitle">
              My journey through professional development and continuous learning
            </p>
          </motion.div>

          {/* Timeline */}
          <div ref={timelineRef} className="timeline-container">
            <div className="timeline-line" ref={timelineLineRef}></div>
            
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                ref={el => experienceItemsRef.current[index] = el}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                variants={timelineVariants}
              >
                <div className="timeline-dot-container">
                  <motion.div
                    ref={el => timelineDotsRef.current[index] = el}
                    className={`timeline-dot ${experience.type}`}
                    variants={timelineDotVariants}
                  ></motion.div>
                </div>
                
                <motion.div 
                  className="timeline-content"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="timeline-header">
                    <h3 className="timeline-title">{experience.title}</h3>
                    <div className="timeline-meta">
                      <span className="timeline-company">{experience.company}</span>
                      <span className="timeline-period">{experience.period}</span>
                    </div>
                  </div>
                  
                  <p className="timeline-description">{experience.description}</p>
                  
                  <div className="timeline-technologies">
                    {experience.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Skills Summary */}
          <motion.div 
            className="skills-summary"
            variants={fadeInUp}
          >
            <h3 className="summary-title">Key Skills & Expertise</h3>
            <div className="skills-categories">
              <div className="skill-category">
                <h4>Frontend Development</h4>
                <div className="skill-items">
                  <span className="skill-item">React</span>
                  <span className="skill-item">Vue.js</span>
                  <span className="skill-item">JavaScript</span>
                  <span className="skill-item">TypeScript</span>
                  <span className="skill-item">CSS3</span>
                  <span className="skill-item">SASS</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>Backend Development</h4>
                <div className="skill-items">
                  <span className="skill-item">Node.js</span>
                  <span className="skill-item">Express</span>
                  <span className="skill-item">Python</span>
                  <span className="skill-item">MongoDB</span>
                  <span className="skill-item">PostgreSQL</span>
                  <span className="skill-item">Redis</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>DevOps & Tools</h4>
                <div className="skill-items">
                  <span className="skill-item">AWS</span>
                  <span className="skill-item">Docker</span>
                  <span className="skill-item">Git</span>
                  <span className="skill-item">CI/CD</span>
                  <span className="skill-item">Linux</span>
                  <span className="skill-item">Nginx</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
