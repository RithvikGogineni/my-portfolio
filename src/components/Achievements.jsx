import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, confettiVariants } from '../animations/framerVariants';

gsap.registerPlugin(ScrollTrigger);

const Achievements = () => {
  const sectionRef = useRef(null);
  const achievementCardsRef = useRef([]);
  const confettiRefs = useRef([]);

  useEffect(() => {
    // Achievement cards animation
    achievementCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Confetti animation on scroll
        const confetti = confettiRefs.current[index];
        if (confetti) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            onEnter: () => {
              gsap.to(confetti, {
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-50, 50],
                rotation: "random(-180, 180)",
                duration: 2,
                ease: [0.25, 0.46, 0.45, 0.94],
                stagger: 0.1
              });
            }
          });
        }

        // Hover effects
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(255, 107, 107, 0.3)",
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          });
        });
      }
    });
  }, []);

  const achievements = [
    {
      id: 1,
      title: "FTC National Inspire Award",
      description: "Led FTC Jamaica team to win the prestigious National Inspire Award, recognizing excellence in robotics design, engineering, and team spirit.",
      icon: "🏆",
      year: "2025",
      category: "Award"
    },
    {
      id: 2,
      title: "FTC Judge's Choice (Ochoa) Award",
      description: "Received Judge's Choice Award at FTC Worlds 2025, highlighting exceptional innovation and technical excellence in robotics competition.",
      icon: "🌟",
      year: "2025",
      category: "Recognition"
    },
    {
      id: 3,
      title: "OUCC Winner",
      description: "Achieved first place in the Outstanding University Computer Competition, demonstrating excellence in programming and problem-solving.",
      icon: "🎤",
      year: "2021 & 2022",
      category: "Competition"
    },
    {
      id: 4,
      title: "FLL Jamaica Representative",
      description: "Represented Jamaica at FIRST Lego League competition in Massachusetts, showcasing robotics skills on an international stage.",
      icon: "👨‍🏫",
      year: "2017",
      category: "International"
    },
    {
      id: 5,
      title: "Chess U1800 Champion",
      description: "Won St. Andrew Parish Chess Championship in U1800 category, demonstrating strategic thinking and competitive excellence.",
      icon: "⭐",
      year: "2022",
      category: "Competition"
    },
    {
      id: 6,
      title: "Grade 2 Piano Distinction",
      description: "Achieved distinction in Grade 2 Piano examination from ABRSM UK, showcasing dedication to musical excellence and discipline.",
      icon: "💡",
      year: "2023",
      category: "Arts"
    }
  ];

  const stats = [
    { number: "12+", label: "Years Robotics Experience" },
    { number: "20+", label: "Students Mentored" },
    { number: "100%", label: "Innovation Focus" },
    { number: "6+", label: "Major Awards" }
  ];

  return (
    <section ref={sectionRef} className="achievements-section section" id="achievements">
      <div className="container">
        <motion.div
          className="achievements-content"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Achievements & Recognition</h2>
            <p className="section-subtitle">
              Celebrating milestones and accomplishments in my journey
            </p>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div 
            className="achievements-grid"
            variants={staggerContainer}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                ref={el => achievementCardsRef.current[index] = el}
                className="achievement-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Confetti Elements */}
                <div className="confetti-container">
                  {[...Array(6)].map((_, confettiIndex) => (
                    <motion.div
                      key={confettiIndex}
                      ref={el => confettiRefs.current[index * 6 + confettiIndex] = el}
                      className="confetti"
                      variants={confettiVariants}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    >
                      🎉
                    </motion.div>
                  ))}
                </div>

                <div className="achievement-icon">{achievement.icon}</div>
                
                <div className="achievement-content">
                  <div className="achievement-header">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <span className="achievement-year">{achievement.year}</span>
                  </div>
                  
                  <p className="achievement-description">{achievement.description}</p>
                  
                  <div className="achievement-category">
                    <span className="category-badge">{achievement.category}</span>
                  </div>
                </div>

                <div className="achievement-glow"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="achievement-stats"
            variants={fadeInUp}
          >
            <h3 className="stats-title">Impact Numbers</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-item"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            className="testimonial"
            variants={fadeInUp}
          >
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <blockquote className="testimonial-text">
                Rithvik's leadership and innovative approach to robotics has been exceptional. 
                His ability to mentor students and drive team success makes him a standout 
                in the STEM community. His dedication to excellence is truly inspiring.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Dr. Maria Rodriguez</div>
                  <div className="author-title">STEM Education Coordinator, FTC Jamaica</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
