// Projects data.
// Images are imported so Vite fingerprints and serves them from the bundle:
// they no longer depend on Firebase Storage being reachable.
import fgcRobot from '../assets/images/fgc-robot.webp';
import ftcRobot from '../assets/images/ftc-robot.webp';
import medrehabWebsite from '../assets/images/medrehab-website.webp';
import properConstructions from '../assets/images/proper-constructions.webp';
import gorillaGym from '../assets/images/gorilla-gym.webp';
import portfolioScreenshot from '../assets/images/portfolio-screenshot.webp';
import ftcStarterGuide from '../assets/images/ftc-starter-guide.webp';
import rehabos from '../assets/images/rehabos.webp';
import roamly from '../assets/images/roamly.webp';
import nexusos from '../assets/images/nexusos.webp';

// No local asset exists for these yet.
const placeholder = '/placeholder-image.svg';
export const projects = [
  {
    id: 1,
    title: "FGC Eco-Equilibrium Robot",
    description:
      "Designed a high-precision flywheel shooter to launch biodiversity units into a 6ft goal using custom projectile calculations and advanced mechanical design.",
    image: fgcRobot,
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
    image: ftcRobot,
    technologies: ["FTC Systems", "Leadership", "Team Management"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "MedRehab Professionals Website",
    description:
      "Designed and built the website and digital branding for Med Rehab Professionals, a physiotherapy and rehabilitation clinic in Kingston, Jamaica — warm, family-first healthcare branding with online booking, services, conditions, and 3D foot scan pages.",
    image: medrehabWebsite,
    technologies: ["Web Development", "Branding", "Healthcare", "Accessibility"],
    category: "web",
    liveUrl: "https://www.medrehabphysio.com/",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Proper Constructions Ltd. Portfolio",
    description:
      "Designed and deployed digital portfolio site for construction firm showcasing projects and services with modern UX.",
    image: properConstructions,
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
    image: gorillaGym,
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
    image: portfolioScreenshot,
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
    image: ftcStarterGuide,
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
    image: placeholder,
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
    image: placeholder,
    technologies: ["Python", "Objective-C", "Machine Learning", "Speech Recognition"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 10,
    title: "Humanoid Robot",
    description:
      "Designed, CAD-modeled, fabricated, and assembled a 3D-printed humanoid robot from scratch, integrating mechanical structure, electronics, and onboard computing. Developed Raspberry Pi/ROS control and onboard LLM-powered conversational command response.",
    image: placeholder,
    technologies: ["Raspberry Pi", "ROS", "CAD", "3D Printing"],
    category: "robotics",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 11,
    title: "RehabOS",
    description:
      "AI-native clinic operating system deployed with Med Rehab Professionals in Kingston, supporting 8+ staff, 100+ patients, and 200+ sessions. Includes AI-assisted intake, clinical-history conflict detection, room/device tracking, exercise verification, automated WhatsApp/SMS follow-ups, and a 3-stage speech pipeline for Jamaican English and Patois.",
    image: rehabos,
    technologies: ["AI/LLM", "Speech Pipelines", "Playwright", "Healthcare"],
    category: "web",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 12,
    title: "Roamly",
    description:
      "Exploration and navigation app that generates routes from mood and time budget across drive, walk, run, and bike modes with turn-by-turn voice guidance. Routing runs on Deno/Supabase Edge Functions for API-key isolation and cross-user caching, with crowdsourced road-safety ratings and an Anthropic-powered multi-day trip planner.",
    image: roamly,
    technologies: ["React Native", "TypeScript", "Supabase", "Mapbox"],
    category: "web",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 13,
    title: "NexusOS",
    description:
      "AI-native inventory platform for e-commerce SMBs, architected around specialist agents for restocking, demand forecasting, and supplier workflows, with supervisor/critic oversight, confidence scoring, and human-approval guardrails.",
    image: nexusos,
    technologies: ["Next.js", "TypeScript", "AI Agents"],
    category: "web",
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
