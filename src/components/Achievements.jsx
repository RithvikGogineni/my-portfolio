import React from 'react';
import { FaTrophy, FaStar, FaMicrophone, FaChalkboardTeacher, FaChess, FaLightbulb } from 'react-icons/fa';
import { Reveal, RevealItem, SectionHeader } from '../animations/motion';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "FTC National Inspire Award",
      description: "Led FTC Jamaica team to win the prestigious National Inspire Award, recognizing excellence in robotics design, engineering, and team spirit.",
      icon: FaTrophy,
      year: "2025",
      category: "Award"
    },
    {
      id: 2,
      title: "FTC Judge's Choice (Ochoa) Award",
      description: "Received Judge's Choice Award at FTC Worlds 2025, highlighting exceptional innovation and technical excellence in robotics competition.",
      icon: FaStar,
      year: "2025",
      category: "Recognition"
    },
    {
      id: 3,
      title: "OUCC Winner",
      description: "Achieved first place in the Outstanding University Computer Competition, demonstrating excellence in programming and problem-solving.",
      icon: FaMicrophone,
      year: "2021 & 2022",
      category: "Competition"
    },
    {
      id: 4,
      title: "FLL Jamaica Representative",
      description: "Represented Jamaica at FIRST Lego League competition in Massachusetts, showcasing robotics skills on an international stage.",
      icon: FaChalkboardTeacher,
      year: "2017",
      category: "International"
    },
    {
      id: 5,
      title: "Chess U1800 Champion",
      description: "Won St. Andrew Parish Chess Championship in U1800 category, demonstrating strategic thinking and competitive excellence.",
      icon: FaChess,
      year: "2022",
      category: "Competition"
    },
    {
      id: 6,
      title: "Grade 2 Piano Distinction",
      description: "Achieved distinction in Grade 2 Piano examination from ABRSM UK, showcasing dedication to musical excellence and discipline.",
      icon: FaLightbulb,
      year: "2023",
      category: "Arts"
    }
  ];


  return (
    <section className="achievements-section section" id="achievements">
      <div className="container">
        <div className="achievements-content">
          <SectionHeader
            title="Achievements & Recognition"
            subtitle="Awards from competition robotics, programming, and beyond"
          />

          <Reveal className="achievements-grid" step={0.08}>
            {achievements.map((achievement) => (
              <RevealItem key={achievement.id} className="achievement-card">
                <div className="achievement-icon" aria-hidden="true">
                  {achievement.icon && React.createElement(achievement.icon)}
                </div>

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
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
