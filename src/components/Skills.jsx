import React from 'react';
import { m } from 'framer-motion';
import { 
  FaRobot, FaCog, FaWrench, FaTrophy, FaBolt,
  FaCode, FaPython, FaJava, FaPalette, FaTheaterMasks, FaImage, FaCube, FaGem, FaBullseye, FaStar,
  FaChess, FaGraduationCap, FaRaspberryPi, FaMicrochip, FaBrain, FaDatabase, FaPrint, FaReact, FaVial
} from 'react-icons/fa';
import { SiTypescript, SiSupabase, SiPostgresql, SiRos, SiVercel } from 'react-icons/si';
import { Reveal, RevealItem, SectionHeader } from '../animations/motion';
import { EASE } from '../animations/variants';

// Bars fill with a transform (scaleX) rather than width, so no layout work.
const Bar = ({ level, className, delay = 0 }) => (
  <m.div
    className={className}
    style={{ width: '100%', transformOrigin: 'left center' }}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: level / 100 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 1.1, ease: EASE, delay }}
  />
);

const Skills = () => {
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
    <section className="skills-section section" id="skills">
      <div className="container">
        <div className="skills-content">
          <SectionHeader
            title="Skills & Expertise"
            subtitle="Hardware, software, and the people skills that hold a team together"
          />

          <Reveal className="technical-skills" step={0.1}>
            {skillCategories.map((category) => (
              <RevealItem key={category.title} className="skill-category-card">
                <div className="category-header">
                  <div className="category-icon" aria-hidden="true">
                    {category.icon && React.createElement(category.icon)}
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                </div>

                <div className="skills-grid">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-header">
                        <div className="skill-icon" aria-hidden="true">
                          {skill.icon && React.createElement(skill.icon)}
                        </div>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      
                      <div className="progress-container">
                        <div className="progress-bar">
                          <Bar className="progress-fill" level={skill.level} delay={skillIndex * 0.05} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RevealItem>
            ))}
          </Reveal>

          <Reveal className="soft-skills">
            <RevealItem as="h3" className="soft-skills-title">Soft Skills</RevealItem>
            <RevealItem className="soft-skills-grid">
              {softSkills.map((skill, index) => (
                <div key={skill.name} className="soft-skill-item">
                  <div className="soft-skill-header">
                    <span className="soft-skill-name">{skill.name}</span>
                    <span className="soft-skill-level">{skill.level}%</span>
                  </div>
                  
                  <div className="soft-skill-progress">
                    <Bar className="soft-skill-bar" level={skill.level} delay={index * 0.05} />
                  </div>
                </div>
              ))}
            </RevealItem>
          </Reveal>

          <Reveal className="certifications">
            <RevealItem as="h3" className="certifications-title">Certifications</RevealItem>
            <RevealItem className="certifications-grid">
              <div className="certification-item">
                <div className="cert-icon"><FaTrophy /></div>
                <div className="cert-content">
                  <h4>FTC National Inspire Award</h4>
                  <p>FIRST Tech Challenge</p>
                  <span className="cert-date">2025</span>
                </div>
              </div>
              
              <div className="certification-item">
                <div className="cert-icon"><FaGraduationCap /></div>
                <div className="cert-content">
                  <h4>Grade 2 Piano Distinction</h4>
                  <p>ABRSM UK</p>
                  <span className="cert-date">2023</span>
                </div>
              </div>
              
              <div className="certification-item">
                <div className="cert-icon"><FaChess /></div>
                <div className="cert-content">
                  <h4>Chess U1800 Champion</h4>
                  <p>St. Andrew Parish</p>
                  <span className="cert-date">2022</span>
                </div>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Skills;
