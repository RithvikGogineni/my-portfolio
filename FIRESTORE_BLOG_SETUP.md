# Firestore Blog Posts Setup Guide

This guide will walk you through setting up the `blogPosts` collection in Firestore.

## Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one if you haven't already)
3. In the left sidebar, click on **Firestore Database**

## Step 2: Create the Collection

1. If you don't have any collections yet, click **"Start collection"**
2. If you already have collections, click **"Add collection"** (top left)
3. Enter the collection ID: `blogPosts` (exactly as shown, case-sensitive)
4. Click **"Next"**

## Step 3: Add Your First Blog Post Document

### Option A: Auto-Generated Document ID (Recommended)

1. Click **"Auto ID"** to generate a random document ID (or type your own, like `post-1`)
2. Add the following fields one by one:

| Field Name | Type | Value |
|------------|------|-------|
| `title` | string | Your Blog Post Title |
| `excerpt` | string | A short description (100-150 characters) |
| `content` | string | Your full blog post in **Markdown** format |
| `coverImage` | string | (Optional) Firebase Storage path (e.g., `images/blog/my-post-cover.jpg`) |
| `category` | string | One of: `Robotics`, `Engineering`, `Mentorship`, `Design`, `General` |
| `date` | string | Format: `YYYY-MM-DD` (e.g., `2025-01-15`) |
| `readTime` | string | Estimated reading time (e.g., `5 min read`) |

3. Click **"Save"**

### Option B: Using a JSON Template

You can also import a JSON file. Here's a template:

```json
{
  "title": "Building My First FTC Robot",
  "excerpt": "A deep dive into the design process and challenges of creating a competitive robotics system.",
  "content": "# Building My First FTC Robot\n\nA deep dive into the design process and challenges of creating a competitive robotics system.\n\n## Introduction\n\nWhen I started building my first FTC robot, I had no idea how complex the process would be.\n\n## Design Process\n\nThe mechanical design involved several key steps:\n\n1. **Conceptualization** - Understanding the game requirements\n2. **CAD Modeling** - Using Fusion 360 to design the robot\n3. **Prototyping** - Building and testing iterations\n\n## Conclusion\n\nBuilding this robot taught me valuable lessons about engineering and teamwork.",
  "category": "Robotics",
  "date": "2025-01-15",
  "readTime": "8 min read"
}
```

## Step 4: Upload Cover Images (Optional but Recommended)

1. Go to **Firebase Storage** in Firebase Console
2. Create a folder: `images/blog/`
3. Upload your cover images (recommended size: 1200x630px for best results)
4. Note the full path (e.g., `images/blog/ftc-robot-cover.jpg`)

## Step 5: Example Blog Post (Copy-Paste Ready)

Here's a complete example you can use:

**Document ID:** `my-first-post` (or use Auto ID)

**Fields:**

```
title: "Building Award-Winning Robots: Lessons from FTC Worlds 2025"
excerpt: "Reflecting on the design process, team collaboration, and the journey to winning the National Inspire Award."
content: "# Building Award-Winning Robots: Lessons from FTC Worlds 2025\n\nReflecting on the design process, team collaboration, and the journey to winning the National Inspire Award.\n\n## The Journey Begins\n\nWhen our team first started working on this season's robot, we knew we had something special. The challenge was complex, but we were determined to create a solution that was both innovative and reliable.\n\n## Key Design Decisions\n\n### Mechanical Design\n\n- **Modularity**: We designed a modular system that could adapt to different game scenarios\n- **Weight Optimization**: Every component was carefully selected to maximize performance within weight constraints\n- **Durability**: We prioritized reliability over flashy features\n\n### Software Approach\n\n```python\n# Example of our autonomous routine\ndef autonomous_routine():\n    # Drive forward\n    drive_forward(24, \"inches\")\n    # Launch game element\n    launch_element()\n    return\n```\n\n## Team Collaboration\n\nWorking with a diverse team taught me valuable lessons:\n\n1. **Communication is key** - Regular meetings kept everyone aligned\n2. **Play to strengths** - Each member contributed their unique skills\n3. **Learn from failures** - Every setback was a learning opportunity\n\n## Conclusion\n\nWinning the National Inspire Award was a testament to our team's dedication, creativity, and perseverance. The real victory was in the journey itself.\n\n> \"The best robots are built with both passion and precision.\"\n\nCheck out more at [FTC Website](https://www.firstinspires.org/robotics/ftc)."
coverImage: "images/blog/ftc-robot-cover.jpg"
category: "Robotics"
date: "2025-01-15"
readTime: "8 min read"
```

**Note:** The `coverImage` field is optional. If you don't have a cover image, just omit this field. The cover image should be uploaded to Firebase Storage first at the path specified.

## Step 6: Verify Firestore Security Rules

Make sure your Firestore rules allow reading blog posts. Go to **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all blog posts
    match /blogPosts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

Click **"Publish"** to save the rules.

## Step 7: Test Your Setup

1. Go to your portfolio website
2. Navigate to the `/blog` page
3. You should see your blog post(s) listed
4. Click on a post to view it - the Markdown should render beautifully!

## Adding More Posts

To add more blog posts:

1. In Firestore, click on the `blogPosts` collection
2. Click **"Add document"**
3. Repeat Step 3 with your new post content

## Tips

- **Document IDs**: You can use descriptive IDs like `ftc-worlds-2025` or let Firebase generate them
- **Date Format**: Always use `YYYY-MM-DD` format for consistent sorting
- **Markdown**: Write your content in Markdown - it will be automatically converted to HTML
- **Categories**: Use consistent categories to help organize your posts
- **Read Time**: Calculate based on ~200-250 words per minute

## Troubleshooting

### Posts not showing up?
- Check that the collection is named exactly `blogPosts` (case-sensitive)
- Verify all required fields are present
- Check browser console for errors
- Ensure Firestore rules allow read access

### Markdown not rendering?
- Make sure you're using Markdown syntax, not HTML
- Check that the `content` field contains Markdown text
- Verify `react-markdown` is installed (it should be after the recent update)

### Images not loading?
- Upload images to Firebase Storage first
- Use the full Firebase Storage URL in your Markdown: `![alt text](https://firebasestorage.googleapis.com/.../image.jpg)`

## Next Steps

Once you have a few posts:
- Add images to make posts more engaging
- Use consistent formatting
- Consider adding tags or additional metadata
- Share your blog posts on social media!

Need help? Check the main `BLOG_GUIDE.md` for Markdown syntax examples.

