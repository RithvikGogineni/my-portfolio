import React from 'react';
import { m } from 'framer-motion';
import { FaBullseye, FaRocket, FaHandshake } from 'react-icons/fa';
import { Reveal, RevealItem, SectionHeader, CountUp } from '../animations/motion';
import { EASE } from '../animations/variants';
import { useFirebaseImage } from '../hooks/useFirebaseImage';
// Imported (not a raw "/src/assets/..." string) so Vite rewrites it to the
// hashed build asset. The literal path only resolves during `vite dev`.
import profilePhoto from '../assets/images/profile-photo.webp';

const About = () => {
  // Load profile image from Firebase Storage, falling back to the bundled photo.
  const { imageUrl: profileImageUrl, loading: profileImageLoading } = useFirebaseImage(
    "images/projects/professional_photo.jpg", // Firebase Storage path
    profilePhoto
  );

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

  // Every figure here is backed by the résumé.
  const achievements = [
    { number: '5', label: 'Years Teaching Robotics' },
    { number: '110+', label: 'Students Taught' },
    { number: '30', label: 'Robotics Club Members Led' },
    { number: '3rd', label: 'Katherine Johnson Award, FIRST Global 2025' },
    { number: 'Captain', label: 'FTC Team 16075, 2025–26' },
    { number: '8+', label: 'Clinic Staff Using RehabOS' }
  ];

  return (
    <section className="about-section section" id="about">
      <div className="container">
        <div className="about-content">
          <SectionHeader
            title="About Me"
            subtitle="Mechanical & Robotics Engineering student who builds robots and the software around them"
          />

          <div className="about-grid">
            <m.div
              className="about-image-container"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className="profile-image-wrapper">
                {profileImageLoading ? (
                  <div className="profile-image-loading">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <img
                    src={profileImageUrl || profilePhoto}
                    alt="Rithvik Gogineni"
                    className="profile-image"
                    onError={(e) => {
                      // Fallback if Firebase image fails to load
                      e.target.src = profilePhoto;
                    }}
                  />
                )}
                <div className="profile-image-bg"></div>
                <div className="profile-image-glow"></div>
              </div>
            </m.div>

            <Reveal className="about-text">
              <RevealItem as="p" className="about-description">
                I’m a Mechanical &amp; Robotics Engineering student at Worcester Polytechnic Institute and a lifelong robotics enthusiast from Kingston, Jamaica, driven by a passion for innovation, mentorship, and purposeful design. I captain Jamaica’s Inspire Award–winning FTC Team 16075 and served as lead engineer for Team Jamaica at the FIRST Global Challenge, where I lead initiatives that merge creativity, engineering, and teamwork to push the boundaries of what’s possible.
              </RevealItem>
              <RevealItem as="p" className="about-description">
                Beyond competition, I'm deeply committed to empowering the next generation of innovators. I mentor students across local schools, guiding them in mechanical design, coding, and problem-solving — helping them discover the same excitement for STEM that shaped my own journey.
              </RevealItem>
              <RevealItem as="p" className="about-description">
                At my core, I'm an engineer who loves to build — not just machines, but ideas, teams, and communities. Whether designing complex mechanisms, writing code, or exploring emerging technologies, I'm always seeking new ways to learn, improve, and make an impact.
              </RevealItem>

              <Reveal className="about-highlights" step={0.1}>
                <RevealItem className="highlight-item">
                  <div className="highlight-icon"><FaBullseye /></div>
                  <div className="highlight-text">
                    <h3>Engineering Innovator</h3>
                    <p>I love tackling complex challenges and finding elegant solutions</p>
                  </div>
                </RevealItem>
                <RevealItem className="highlight-item">
                  <div className="highlight-icon"><FaRocket /></div>
                  <div className="highlight-text">
                    <h3>Lifelong Builder</h3>
                    <p>Always exploring new technologies and improving my skills</p>
                  </div>
                </RevealItem>
                <RevealItem className="highlight-item">
                  <div className="highlight-icon"><FaHandshake /></div>
                  <div className="highlight-text">
                    <h3>Collaborative Leader</h3>
                    <p>Collaborative approach with strong communication skills</p>
                  </div>
                </RevealItem>
              </Reveal>
            </Reveal>
          </div>

          <Reveal className="skills-section">
            <RevealItem as="h3" className="skills-title">Core Toolkit</RevealItem>
            <RevealItem as="p" className="skills-caption">Focused on building resilient robotics systems with thoughtful software and design.</RevealItem>
            <Reveal className="tech-stack-grid" step={0.1}>
              {techStacks.map((stack) => (
                <RevealItem key={stack.title} className="tech-stack-card">
                  <h4>{stack.title}</h4>
                  <ul>
                    {stack.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </Reveal>
          </Reveal>

          <Reveal className="achievements-grid" step={0.06}>
            {achievements.map((achievement) => (
              <RevealItem key={achievement.label} className="achievement-item">
                <CountUp className="achievement-number" value={achievement.number} />
                <div className="achievement-label">{achievement.label}</div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
