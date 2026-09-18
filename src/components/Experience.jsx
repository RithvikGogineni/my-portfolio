import React, { useRef } from 'react';
import { m, useScroll, useSpring } from 'framer-motion';
import { Reveal, RevealItem, SectionHeader } from '../animations/motion';
import { EASE } from '../animations/variants';

const Experience = () => {
  const timelineRef = useRef(null);
  // The timeline line draws itself as you scroll through the section.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 60%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const experiences = [
    {
      id: 1,
      title: "Captain",
      company: "FIRST Tech Challenge \u2014 Team 16075, Jamaica",
      period: "2024 - 2026",
      description: "Captain (2025-26) and Vice-Captain (2024-25). Lead mechanical integration and iterative development of competition robots \u2014 intake, transfer, launching, autonomous systems, competition debugging, and engineering documentation. Helped earn the Jamaica Inspire Award and Judges' Choice (Ochoa) Award at the 2025 FIRST Championship.",
      technologies: ["FTC Systems", "Mechanical Integration", "Autonomous", "Leadership"],
      type: "work"
    },
    {
      id: 2,
      title: "Lead Engineer",
      company: "FIRST Global Challenge \u2014 Team Jamaica",
      period: "2025",
      description: "Led robot design, mechanical integration, testing, and competition iteration for Jamaica's national team at the Eco-Equilibrium challenge in Panama. Finished on the 3rd-place finalist alliance and earned 3rd place for the Katherine Johnson Award for engineering documentation.",
      technologies: ["Robot Design", "Mechanical Integration", "Testing", "Documentation"],
      type: "work"
    },
    {
      id: 3,
      title: "Robotics Club President",
      company: "Campion College",
      period: "2024 - 2026",
      description: "President (2025-26), Vice-President (2024-25). Led technical workshops for 30 members, directed team builds, and ran community STEM outreach programs.",
      technologies: ["Leadership", "Mentorship", "STEM Education", "Event Planning"],
      type: "work"
    },
    {
      id: 4,
      title: "Aeronautics Club President",
      company: "Campion College",
      period: "2022 - 2026",
      description: "President (2023-26), Secretary (2022-23). Managed model flight design projects and student engagement in aerospace engineering, and led workshops on aerodynamics and flight principles. Also served as Vice-President of the Motorsport Club (2025-26).",
      technologies: ["Aerospace", "Engineering", "Project Management", "Education"],
      type: "work"
    },
    {
      id: 5,
      title: "Robotics Teacher",
      company: "Vaz Preparatory School",
      period: "2025 - 2026",
      description: "Designed and taught hands-on robotics lessons for 30+ students in Grades 1-6, introducing engineering, programming, and iterative problem-solving.",
      technologies: ["Teaching", "STEM Education", "Curriculum Development"],
      type: "work"
    },
    {
      id: 6,
      title: "Robotics Teacher",
      company: "Halls of Learning / Supreme Ventures Foundation",
      period: "2021 - 2025",
      description: "Progressed from teaching assistant to instructor. Taught 80+ students, including underserved youth and children in care, and mentored teams for national robotics competitions.",
      technologies: ["Teaching", "Mentorship", "STEM Education", "Outreach"],
      type: "work"
    },
    {
      id: 7,
      title: "Freelance Web Developer & Designer",
      company: "Self-Employed",
      period: "2023 - Present",
      description: "Built websites and digital branding for Med Rehab Professionals (medrehabphysio.com), Proper Constructions Ltd., Gorilla Gym, and Club1962. Focused on modern UX and accessibility.",
      technologies: ["Web Development", "Brand Design", "Client Work", "UX/UI"],
      type: "work"
    },
    {
      id: 8,
      title: "B.S. Mechanical Engineering & Robotics Engineering",
      company: "Worcester Polytechnic Institute (WPI)",
      period: "Expected May 2030",
      description: "Pursuing a dual focus in Mechanical Engineering and Robotics Engineering in Worcester, MA.",
      technologies: ["Mechanical Engineering", "Robotics Engineering"],
      type: "education"
    },
    {
      id: 9,
      title: "CAPE Sixth Form",
      company: "Campion College",
      period: "2019 - 2026",
      description: "Pure Mathematics, Physics, and Economics. Second Honours Award (2023-24, 2025-26).",
      technologies: ["Mathematics", "Physics", "Economics", "Academic Excellence"],
      type: "education"
    }
  ];

  return (
    <section className="experience-section section" id="experience">
      <div className="container">
        <div className="experience-content">
          <SectionHeader
            title="Experience & Education"
            subtitle="Competition robotics, teaching, and building software people use"
          />

          {/* Timeline */}
          <div ref={timelineRef} className="timeline-container">
            <m.div className="timeline-line" style={{ scaleY: lineScale }} aria-hidden="true" />

            {experiences.map((experience, index) => (
              <m.div
                key={experience.id}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              >
                <div className="timeline-dot-container">
                  <m.div
                    className={`timeline-dot ${experience.type}`}
                    variants={{
                      hidden: { scale: 0 },
                      show: { scale: 1, transition: { duration: 0.5, ease: EASE } },
                    }}
                  ></m.div>
                </div>

                <m.div
                  className="timeline-content"
                  variants={{
                    hidden: { opacity: 0, x: index % 2 === 0 ? -24 : 24 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE, delay: 0.1 } },
                  }}
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
                </m.div>
              </m.div>
            ))}
          </div>

          <Reveal className="skills-summary">
            <RevealItem as="h3" className="summary-title">Key Skills & Expertise</RevealItem>
            <RevealItem className="skills-categories">
              <div className="skill-category">
                <h4>Robotics, Hardware & CAD</h4>
                <div className="skill-items">
                  <span className="skill-item">ROS</span>
                  <span className="skill-item">Raspberry Pi</span>
                  <span className="skill-item">Arduino</span>
                  <span className="skill-item">REV Robotics</span>
                  <span className="skill-item">3D Printing</span>
                  <span className="skill-item">Fusion 360</span>
                  <span className="skill-item">Onshape</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>Programming & Software</h4>
                <div className="skill-items">
                  <span className="skill-item">Python</span>
                  <span className="skill-item">TypeScript/JavaScript</span>
                  <span className="skill-item">Java</span>
                  <span className="skill-item">React Native</span>
                  <span className="skill-item">Supabase</span>
                  <span className="skill-item">PostgreSQL</span>
                  <span className="skill-item">Vercel</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>AI/ML</h4>
                <div className="skill-items">
                  <span className="skill-item">OpenAI & Anthropic APIs</span>
                  <span className="skill-item">LLM Agents</span>
                  <span className="skill-item">Speech-to-Text Pipelines</span>
                  <span className="skill-item">AI Evaluation</span>
                  <span className="skill-item">Multi-Armed Bandits</span>
                </div>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Experience;
