// Framer Motion animation variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 60
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const fadeInLeft = {
  initial: {
    opacity: 0,
    x: -60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const fadeInRight = {
  initial: {
    opacity: 0,
    x: 60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const rotateIn = {
  initial: {
    opacity: 0,
    rotate: -180,
    scale: 0.5
  },
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Card animations
export const cardVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Button animations
export const buttonVariants = {
  initial: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }
};

// Magnetic button effect
export const magneticVariants = {
  initial: {
    x: 0,
    y: 0
  },
  hover: {
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Text animations
export const textVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const staggerText = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Icon animations
export const iconVariants = {
  initial: {
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.2,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Timeline animations
export const timelineVariants = {
  initial: {
    opacity: 0,
    x: -30
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const timelineDotVariants = {
  initial: {
    scale: 0
  },
  animate: {
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const timelineLineVariants = {
  initial: {
    scaleY: 0
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

// Progress bar animations
export const progressVariants = {
  initial: {
    width: "0%"
  },
  animate: {
    width: "100%",
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  }
};

// Floating animation
export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Confetti animation
export const confettiVariants = {
  initial: {
    opacity: 0,
    scale: 0,
    y: 0
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    y: [-100, 100],
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  }
};

// Page transition variants
export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export const pageSlide = {
  initial: {
    opacity: 0,
    x: "-100%"
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: "100%"
  }
};
