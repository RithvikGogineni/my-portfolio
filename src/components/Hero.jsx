import React from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CountUp } from '../animations/motion';
import { EASE } from '../animations/variants';
import { RESUME_URL } from './Navbar';

const headline = ['I', 'design,', 'build,', 'and', 'program', 'robots.'];

// Hero plays once on load: headline words rise out of a mask, then the
// supporting copy and the summary card follow. Everything is short (<1.2s)
// so the page reads as ready almost immediately.
const intro = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const word = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
};
const rise = (delay) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
});

const stats = [
  { value: '5', label: 'Years teaching robotics' },
  { value: '110+', label: 'Students taught' },
  { value: '200+', label: 'Clinic sessions run on RehabOS' },
];

const Hero = () => (
  <section className="hero-section" id="home">
    <m.div className="container hero-container" initial="hidden" animate="show">
      <div className="hero-intro">
        <m.span className="hero-availability" variants={rise(0)}>
          <span className="availability-dot" aria-hidden="true"></span>
          Open to Summer 2027 internships
        </m.span>

        <m.h1 className="hero-title" variants={intro} aria-label={headline.join(' ')}>
          {headline.map((w, i) => (
            <span className="hero-word-mask" key={i} aria-hidden="true">
              <m.span
                className={`hero-word ${w.startsWith('robots') ? 'hero-word-accent' : ''}`}
                variants={word}
              >
                {w}
              </m.span>
            </span>
          ))}
        </m.h1>

        <m.p className="hero-description" variants={rise(0.35)}>
          Mechanical &amp; Robotics Engineering student at WPI. Captain of FTC Team 16075,
          lead engineer for Team Jamaica at FIRST Global 2025, and founder of RehabOS, an
          AI clinic platform deployed at a physiotherapy clinic in Kingston.
        </m.p>

        <m.div className="hero-actions" variants={rise(0.45)}>
          <Link to="/projects" className="btn btn-primary">
            View projects
          </Link>
          <a href={RESUME_URL} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
            Download résumé
          </a>
          <a href="mailto:goginenirithvik@gmail.com" className="btn btn-text">
            goginenirithvik@gmail.com
          </a>
        </m.div>
      </div>

      <m.div className="hero-summary" variants={rise(0.55)}>
        <div className="summary-card">
          <span className="summary-label">Currently</span>
          <p className="summary-text">
            B.S. Mechanical &amp; Robotics Engineering, WPI (Class of 2030) · Founder, RehabOS
          </p>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="summary-stat">
              <CountUp className="stat-value" value={stat.value} />
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </m.div>
    </m.div>
  </section>
);

export default Hero;
