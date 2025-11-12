// Utility to get gallery images for a section
// Since Firebase Storage doesn't support listing files from client,
// we maintain a list of image filenames here
// You can update this list when you add new images

export const getGalleryImagesForSection = (sectionId) => {
  // Map of section IDs to their image filenames
  const sectionImages = {
    blender: [
      // Add your Blender image filenames here
      // Example: 'render-1.png', 'model-2.png', etc.
      // These will be loaded from: images/gallery/blender/{filename}
    ],
    robotics: [
      // Add your Robotics image filenames here
    ],
    competition: [
      // Add your Competition image filenames here
    ],
    engineering: [
      // Add your Engineering image filenames here
    ],
    leadership: [
      // Add your Leadership image filenames here
    ],
    education: [
      // Add your Education image filenames here
    ]
  };

  return sectionImages[sectionId] || [];
};

// Helper to generate full Firebase Storage path
export const getGalleryImagePath = (sectionId, filename) => {
  const section = {
    blender: 'images/gallery/blender',
    robotics: 'images/gallery/robotics',
    competition: 'images/gallery/competition',
    engineering: 'images/gallery/engineering',
    leadership: 'images/gallery/leadership',
    education: 'images/gallery/education'
  };

  return `${section[sectionId] || 'images/gallery'}/${filename}`;
};

