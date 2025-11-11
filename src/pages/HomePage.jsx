import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Achievements from '../components/Achievements';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

const HomePage = () => {
  return (
    <main className="main-content">
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Achievements />
      <Gallery />
      <Blog />
      <Contact />
    </main>
  );
};

export default HomePage;
