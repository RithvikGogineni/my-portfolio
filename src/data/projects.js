// Projects data with Firebase Storage paths
// Images are stored in Firebase Storage at: images/projects/{filename}
export const projects = [
  {
    id: 1,
    title: "FGC Eco-Equilibrium Robot",
    description:
      "Designed a high-precision flywheel shooter to launch biodiversity units into a 6ft goal using custom projectile calculations and advanced mechanical design.",
    image: "images/projects/fgc-robot.png", // Firebase Storage path
    technologies: ["CAD Design", "Mechanical Engineering", "Physics Calculations"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "FTC Jamaica Inspire Award Robot",
    description:
      "Led mechanical and programming teams to win National Inspire and Judge's Choice (Ochoa) Awards at FTC Worlds 2025.",
    image: "images/projects/ftc-robot.png",
    technologies: ["FTC Systems", "Leadership", "Team Management"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "MedRehab Professionals Website",
    description:
      "Developed responsive website for medical practice with focus on user accessibility and modern healthcare branding.",
    image: "images/projects/medrehab-website.png",
    technologies: ["Web Development", "Branding", "Accessibility"],
    category: "web",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Proper Constructions Ltd. Portfolio",
    description:
      "Designed and deployed digital portfolio site for construction firm showcasing projects and services with modern UX.",
    image: "images/projects/proper-constructions.png",
    technologies: ["Freelance", "Client Work", "Brand Design"],
    category: "web",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Gorilla Gym & Club1962 Websites",
    description:
      "Created brand-aligned online platforms integrating modern, minimal UX design for fitness and entertainment venues.",
    image: "images/projects/gorilla-gym.png",
    technologies: ["Web Design", "Freelance", "Brand Integration"],
    category: "design",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Personal Portfolio Website",
    description:
      "My personal portfolio showcasing robotics, design, and leadership through motion and interaction.",
    image: "images/projects/portfolio-screenshot.png",
    technologies: ["React", "Framer Motion", "GSAP", "CSS3"],
    category: "web",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 7,
    title: "Campion FTC Starter Guide",
    description:
      "Created a comprehensive guide for new FIRST Tech Challenge teams covering engineering design, control systems, and strategy fundamentals.",
    image: "images/projects/ftc-starter-guide.png",
    technologies: ["Technical Writing", "Education", "Engineering Design"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 8,
    title: "Autonomous Object Tracking System",
    description:
      "Developed an AI-powered object tracking prototype using OpenCV and TensorFlow, capable of following color and shape targets for robotics applications.",
    image: "images/projects/object-tracking.png",
    technologies: ["Python", "Computer Vision", "Machine Learning"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 9,
    title: "Jarvis AI Assistant",
    description:
      "Developing a cross-platform AI assistant with natural language processing, speech recognition, face detection, and reinforcement learning capabilities.",
    image: "images/projects/jarvis-ai.png",
    technologies: ["Python", "Objective-C", "Machine Learning", "Speech Recognition"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const categories = [
  {
    id: "all",
    label: "All",
    headline: "Every Build, One Timeline",
    description:
      "A panoramic look at robots, digital products, and visual systems that showcase how engineering, code, and design overlap in my work.",
  },
  {
    id: "robotics",
    label: "Robotics",
    headline: "Machines With Purpose",
    description:
      "Competition-ready robots engineered for precision, reliability, and storytelling—built for FIRST Tech Challenge, FGC, and STEM outreach across Jamaica.",
  },
  {
    id: "web",
    label: "Web",
    headline: "Interfaces That Guide Action",
    description:
      "Web apps and platforms crafted for clients and community teams, centered on clarity, accessibility, and supporting the stories behind every brand.",
  },
  {
    id: "design",
    label: "Design",
    headline: "Visual Systems & Identity",
    description:
      "Concept art, branding, and motion studies that turn robotics and STEM projects into experiences people actually remember.",
  },
];
