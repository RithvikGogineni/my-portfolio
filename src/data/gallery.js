// Gallery data organized by sections
// Images are stored in Firebase Storage at: images/gallery/{section}/{filename}

export const gallerySections = [
  {
    id: 'blender',
    title: 'Blender & 3D Design',
    description: '3D modeling, renders, and visual design work',
    path: 'images/gallery/blender'
  },
  {
    id: 'robotics',
    title: 'Robotics',
    description: 'Robot builds, competitions, and team sessions',
    path: 'images/gallery/robotics'
  },
  {
    id: 'competition',
    title: 'Competitions',
    description: 'Competition moments and achievements',
    path: 'images/gallery/competition'
  },
  {
    id: 'engineering',
    title: 'Engineering',
    description: 'CAD work, prototypes, and technical projects',
    path: 'images/gallery/engineering'
  },
  {
    id: 'leadership',
    title: 'Leadership & Mentorship',
    description: 'Team leadership and teaching moments',
    path: 'images/gallery/leadership'
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Workshops, teaching, and STEM outreach',
    path: 'images/gallery/education'
  }
];

// Gallery items organized by section
// You can add specific items here, or load dynamically from Firebase
export const galleryItems = {
  blender: [
    // Add your Blender images here
    // Example structure:
    // {
    //   id: 1,
    //   title: "3D Robot Render",
    //   image: "images/gallery/blender/robot-render.png",
    //   section: "blender"
    // }
  ],
  robotics: [
    // Add your Robotics images here
  ],
  competition: [
    // Add your Competition images here
  ],
  engineering: [
    // Add your Engineering images here
  ],
  leadership: [
    // Add your Leadership images here
  ],
  education: [
    // Add your Education images here
  ]
};

