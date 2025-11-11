# Media Assets Guide

## 📁 Folder Structure
```
src/assets/
├── images/
│   ├── hero-background.jpg          # Hero section background
│   ├── profile-photo.jpg           # About section profile photo
│   ├── fgc-robot.jpg               # FGC Eco-Equilibrium Robot
│   ├── ftc-robot.jpg               # FTC Jamaica Inspire Award Robot
│   ├── medrehab-website.jpg        # MedRehab Professionals Website
│   ├── proper-constructions.jpg    # Proper Constructions Ltd. Portfolio
│   ├── gorilla-gym.jpg            # Gorilla Gym & Club1962 Websites
│   ├── portfolio-screenshot.jpg   # Personal Portfolio Website
│   └── gallery/
│       ├── ftc-build-session.jpg   # FTC Team Build Session
│       ├── robot-competition.jpg   # Robot Competition Action
│       ├── cad-design.jpg          # CAD Design Work
│       ├── mentorship.jpg         # Team Mentorship
│       ├── award-ceremony.jpg     # Award Ceremony
│       └── workshop-teaching.jpg   # Workshop Teaching
└── videos/
    └── robotics-build.mp4         # Optional: Hero background video
```

## 🖼️ Image Specifications

### Hero Background (`hero-background.jpg`)
- **Size**: 1920x1080px minimum
- **Format**: JPG or WebP
- **Content**: Photo of you working on robotics project, team photo, or dynamic build
- **Alt Text**: "Rithvik Gogineni working on robotics project"

### Profile Photo (`profile-photo.jpg`)
- **Size**: 400x400px (square)
- **Format**: JPG or WebP
- **Content**: Professional headshot or photo of you in robotics context
- **Alt Text**: "Rithvik Gogineni - Robotics Innovator and STEM Leader"

### Project Images
- **Size**: 600x400px
- **Format**: JPG or WebP
- **Content**: Screenshots, photos, or renders of your actual projects
- **Alt Text**: Descriptive text for each project

### Gallery Images
- **Size**: 600x400px
- **Format**: JPG or WebP
- **Content**: Photos from robotics competitions, team builds, workshops, etc.
- **Alt Text**: Descriptive text for each scene

## 🎥 Video Specifications (Optional)

### Hero Background Video (`robotics-build.mp4`)
- **Duration**: 10-30 seconds (looped)
- **Size**: 1920x1080px
- **Format**: MP4
- **Content**: Time-lapse of robot build, team working, competition footage
- **Settings**: Muted, autoplay, loop

## 📝 Alt Text Examples

Replace placeholder alt text with descriptive content:

```html
<!-- Hero Background -->
<img src="/src/assets/images/hero-background.jpg" 
     alt="Rithvik Gogineni presenting FTC robot at nationals 2025" />

<!-- Profile Photo -->
<img src="/src/assets/images/profile-photo.jpg" 
     alt="Rithvik Gogineni - Vice-Captain of FTC Jamaica National Inspire Award-winning team" />

<!-- Project Images -->
<img src="/src/assets/images/ftc-robot.jpg" 
     alt="FTC Jamaica Inspire Award robot with custom flywheel shooter mechanism" />

<!-- Gallery Images -->
<img src="/src/assets/images/gallery/ftc-build-session.jpg" 
     alt="FTC team build session in Kingston, Jamaica 2024" />
```

## 🚀 Implementation Notes

1. **Image Optimization**: Compress images for web (aim for <500KB each)
2. **WebP Support**: Use WebP format for better compression
3. **Lazy Loading**: Images are automatically lazy-loaded for performance
4. **Responsive**: Images scale appropriately on all devices
5. **Video Controls**: Videos autoplay muted and loop on desktop, pause on mobile

## 📱 Mobile Considerations

- Videos automatically pause on mobile devices
- Images are optimized for mobile viewing
- Gallery uses touch-friendly interactions
- All media respects user's data preferences

## 🔄 How to Update

1. Replace placeholder images with your actual photos/videos
2. Update alt text to be descriptive and accessible
3. Ensure file names match the component references
4. Test on both desktop and mobile devices
5. Verify all images load correctly

## 🎨 Design Tips

- Use high-contrast images that work well with the dark theme
- Ensure your face/team is clearly visible in photos
- Include action shots that show robotics work in progress
- Mix technical shots with team/leadership moments
- Consider using video for dynamic hero backgrounds
