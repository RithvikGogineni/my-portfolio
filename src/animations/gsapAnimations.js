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

// Custom cursor animation with magnetic effects
export const initCustomCursor = () => {
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  let isHovering = false;
  let isClicking = false;

  // Hide default cursor on desktop
  if (window.innerWidth > 768) {
    document.body.style.cursor = 'none';
  }

  // Mouse move handler
  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  document.addEventListener('mousemove', handleMouseMove);

  // Click handlers
  document.addEventListener('mousedown', () => {
    isClicking = true;
    gsap.to(cursor, { scale: 0.8, duration: 0.1 });
    gsap.to(cursorFollower, { scale: 1.2, duration: 0.1 });
  });

  document.addEventListener('mouseup', () => {
    isClicking = false;
    gsap.to(cursor, { scale: 1, duration: 0.2 });
    gsap.to(cursorFollower, { scale: 1, duration: 0.2 });
  });

  // Hover detection for interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .blog-card, .gallery-item, .btn, .nav-link, input, textarea, [role="button"]'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: 'back.out(1.7)' });
      gsap.to(cursorFollower, { scale: 1.8, opacity: 0.6, duration: 0.3 });
    });

    el.addEventListener('mouseleave', () => {
      isHovering = false;
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
      gsap.to(cursorFollower, { scale: 1, opacity: 0.3, duration: 0.3 });
    });
  });

  // Magnetic effect for buttons
  interactiveElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;
      
      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // Smooth cursor animation
  gsap.ticker.add(() => {
    // Main cursor - fast and precise
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    // Follower - slower and smoother
    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;
    
    gsap.set(cursor, { 
      x: cursorX, 
      y: cursorY,
      transform: 'translate(-50%, -50%)'
    });
    
    gsap.set(cursorFollower, { 
      x: followerX, 
      y: followerY,
      transform: 'translate(-50%, -50%)'
    });
  });

  // Particle trail effect
  let particleCount = 0;
  const createParticle = () => {
    if (particleCount > 5) return; // Limit particles
    
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    document.body.appendChild(particle);
    particleCount++;

    gsap.set(particle, {
      x: mouseX,
      y: mouseY,
      scale: 0,
      opacity: 0.8
    });

    gsap.to(particle, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        particle.remove();
        particleCount--;
      }
    });
  };

  // Create particles on mouse move (throttled)
  let lastParticleTime = 0;
  document.addEventListener('mousemove', () => {
    const now = Date.now();
    if (now - lastParticleTime > 50) { // Throttle to 20fps
      createParticle();
      lastParticleTime = now;
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
