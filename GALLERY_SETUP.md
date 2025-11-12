# Gallery Setup Guide

## How to Add Images to Gallery Sections

The gallery is now split into sections. To display your images, you need to add their filenames to the Gallery component.

### Step 1: Upload Images to Firebase Storage

Make sure your images are uploaded to the correct Firebase Storage paths:
- **Blender**: `images/gallery/blender/`
- **Robotics**: `images/gallery/robotics/`
- **Competition**: `images/gallery/competition/`
- **Engineering**: `images/gallery/engineering/`
- **Leadership**: `images/gallery/leadership/`
- **Education**: `images/gallery/education/`

### Step 2: Add Image Filenames

Open `src/components/Gallery.jsx` and find the `getSectionImageFilenames` function (around line 22).

Add your image filenames to the appropriate section array:

```javascript
const getSectionImageFilenames = (sectionId) => {
  const imageMap = {
    blender: [
      'image1.png',        // Add your Blender image filenames here
      'render-2.jpg',      // Example: 'render-2.jpg'
      'model-3.png',       // Make sure these match exactly what you uploaded
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
  return imageMap[sectionId] || [];
};
```

### Example

If you uploaded these files to `images/gallery/blender/`:
- `robot-render-1.png`
- `scene-design-2.jpg`
- `model-final.png`

Then your `blender` array should be:
```javascript
blender: [
  'robot-render-1.png',
  'scene-design-2.jpg',
  'model-final.png'
]
```

### Important Notes

1. **Exact Filenames**: The filenames must match exactly what you uploaded to Firebase Storage (including file extensions and case sensitivity).

2. **File Extensions**: Include the file extension (`.png`, `.jpg`, `.jpeg`, etc.)

3. **Path Structure**: Images are automatically loaded from `images/gallery/{sectionId}/{filename}`

4. **Image Titles**: Image titles are automatically generated from filenames by:
   - Removing file extensions
   - Replacing dashes and underscores with spaces
   - Example: `robot-render-1.png` becomes "robot render 1"

### Quick Reference

**Current Sections:**
- `blender` - Blender & 3D Design
- `robotics` - Robotics
- `competition` - Competitions
- `engineering` - Engineering
- `leadership` - Leadership & Mentorship
- `education` - Education

**Firebase Storage Paths:**
- Blender images: `images/gallery/blender/{filename}`
- Robotics images: `images/gallery/robotics/{filename}`
- Competition images: `images/gallery/competition/{filename}`
- Engineering images: `images/gallery/engineering/{filename}`
- Leadership images: `images/gallery/leadership/{filename}`
- Education images: `images/gallery/education/{filename}`

### Testing

After adding filenames:
1. Make sure your Firebase config is set up correctly
2. Verify images are uploaded to the correct Firebase Storage paths
3. Check the browser console for any loading errors
4. Images will show a loading spinner while fetching from Firebase

