import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation configurations
export const animations = {
  // Hero section animations
  hero: {
    title: {
      duration: 1.2,
      ease: "power2.out",
      stagger: 0.1,
      from: { y: 50, opacity: 0 },
      to: { y: 0, opacity: 1 }
    },
    subtitle: {
      duration: 1,
      ease: "power2.out",
      delay: 0.5,
      from: { y: 30, opacity: 0 },
      to: { y: 0, opacity: 1 }
    },
    cta: {
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 1,
      from: { scale: 0.8, opacity: 0 },
      to: { scale: 1, opacity: 1 }
    },
    scrollIndicator: {
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      from: { y: 0 },
      to: { y: 10 }
    }
  },

  // Section entrance animations
  section: {
    fadeInUp: {
      duration: 1,
      ease: "power2.out",
      from: { y: 60, opacity: 0 },
      to: { y: 0, opacity: 1 }
    },
    slideInLeft: {
      duration: 1,
      ease: "power2.out",
      from: { x: -60, opacity: 0 },
      to: { x: 0, opacity: 1 }
    },
    slideInRight: {
      duration: 1,
      ease: "power2.out",
      from: { x: 60, opacity: 0 },
      to: { x: 0, opacity: 1 }
    }
  },

  // Card animations
  card: {
    hover: {
      duration: 0.3,
      ease: "power2.out",
      scale: 1.05,
      y: -10,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
    },
    reveal: {
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
      from: { y: 50, opacity: 0, scale: 0.9 },
      to: { y: 0, opacity: 1, scale: 1 }
    }
  },

  // Timeline animations
  timeline: {
    line: {
      duration: 1.5,
      ease: "power2.out",
      from: { scaleY: 0 },
      to: { scaleY: 1 }
    },
    dot: {
      duration: 0.5,
      ease: "back.out(1.7)",
      from: { scale: 0 },
      to: { scale: 1 }
    },
    content: {
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2,
      from: { x: -30, opacity: 0 },
      to: { x: 0, opacity: 1 }
    }
  },

  // Skills animations
  skills: {
    icon: {
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1,
      from: { scale: 0, rotation: -180 },
      to: { scale: 1, rotation: 0 }
    },
    hover: {
      duration: 0.3,
      ease: "power2.out",
      scale: 1.2,
      rotation: 5
    },
    progress: {
      duration: 2,
      ease: "power2.out",
      from: { width: "0%" },
      to: { width: "100%" }
    }
  },

  // Floating elements
  floating: {
    duration: 3,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    from: { y: 0 },
    to: { y: -20 }
  },

  // Parallax
  parallax: {
    slow: { yPercent: -50 },
    medium: { yPercent: -30 },
    fast: { yPercent: -10 }
  }
};

// Utility functions
export const createScrollTrigger = (element, animation, options = {}) => {
  return ScrollTrigger.create({
    trigger: element,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    ...options
  });
};

export const createStaggerAnimation = (elements, animation, stagger = 0.1) => {
  return gsap.fromTo(elements, animation.from, {
    ...animation.to,
    duration: animation.duration,
    ease: animation.ease,
    stagger: stagger
  });
};

export const createHoverAnimation = (element, animation) => {
  const hoverTl = gsap.timeline({ paused: true });
  
  hoverTl.to(element, {
    ...animation,
    duration: animation.duration,
    ease: animation.ease
  });

  element.addEventListener('mouseenter', () => hoverTl.play());
  element.addEventListener('mouseleave', () => hoverTl.reverse());
  
  return hoverTl;
};

// Custom cursor animation with trail effect
export const initCustomCursor = () => {
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorTrail = document.querySelector('.cursor-trail');
  
  if (!cursor || !cursorFollower) return;

  // Hide default cursor completely
  document.documentElement.style.cursor = 'none';
  document.body.style.cursor = 'none';

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  const trail = [];
  const trailLength = 8;

  // Initialize trail elements
  if (cursorTrail) {
    for (let i = 0; i < trailLength; i++) {
      const trailDot = document.createElement('div');
      trailDot.className = 'cursor-trail-dot';
      cursorTrail.appendChild(trailDot);
      trail.push({ element: trailDot, x: 0, y: 0 });
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Check for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"], .project-card, .blog-card, .gallery-item');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('cursor-hover');
      cursorFollower?.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('cursor-hover');
      cursorFollower?.classList.remove('cursor-hover');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursor?.classList.add('cursor-click');
    cursorFollower?.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    cursor?.classList.remove('cursor-click');
    cursorFollower?.classList.remove('cursor-click');
  });

  // Smooth animation loop
  gsap.ticker.add(() => {
    // Main cursor - instant
    cursorX = mouseX;
    cursorY = mouseY;
    gsap.set(cursor, { 
      x: cursorX - 10, 
      y: cursorY - 10 
    });

    // Follower - smooth lag
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(cursorFollower, { 
      x: followerX - 20, 
      y: followerY - 20 
    });

    // Trail - cascading effect
    if (trail.length > 0) {
      let prevX = mouseX;
      let prevY = mouseY;
      
      trail.forEach((dot, index) => {
        const delay = (index + 1) * 0.05;
        const speed = 0.2 - (index * 0.02);
        
        dot.x += (prevX - dot.x) * speed;
        dot.y += (prevY - dot.y) * speed;
        
        gsap.set(dot.element, {
          x: dot.x - 3,
          y: dot.y - 3,
          opacity: 1 - (index / trailLength) * 0.8,
          scale: 1 - (index / trailLength) * 0.5
        });
        
        prevX = dot.x;
        prevY = dot.y;
      });
    }
  });
};

// Scroll progress bar
export const initScrollProgress = () => {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      gsap.to(progressBar, {
        width: `${self.progress * 100}%`,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
};
