# Firebase Setup Guide

This guide will help you set up Firebase Storage for images and Firestore for blog posts.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "my-portfolio")
   - Enable/disable Google Analytics (optional)
   - Click "Create Project"

## Step 2: Enable Firebase Storage

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click "Get Started"
3. Choose "Start in test mode" (we'll set up security rules later)
4. Select a storage location (choose closest to your users)
5. Click "Done"

### Set Up Storage Security Rules

Go to **Storage > Rules** and update to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all images
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## Step 3: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click "Create Database"
3. Choose "Start in test mode" (we'll set up security rules later)
4. Select a location (same as Storage)
5. Click "Enable"

### Set Up Firestore Security Rules

Go to **Firestore Database > Rules** and update to:

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

## Step 4: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app (give it a nickname like "Portfolio Web")
6. Copy the Firebase configuration object

## Step 5: Update Firebase Config

Open `src/config/firebase.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 6: Upload Images to Firebase Storage

### Option A: Using Firebase Console (Web UI)

1. Go to **Storage** in Firebase Console
2. Click "Upload file"
3. Create folder structure: `images/projects/`
4. Upload all your project images:
   - `fgc-robot.png`
   - `ftc-robot.png`
   - `medrehab-website.png`
   - `proper-constructions.png`
   - `gorilla-gym.png`
   - `portfolio-screenshot.png`
   - `ftc-starter-guide.png`
   - `object-tracking.png`
   - `jarvis-ai.png`

### Option B: Using Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init storage

# Upload images
firebase storage:upload src/assets/images/fgc-robot.png images/projects/fgc-robot.png
# Repeat for all images...
```

### Option C: Using a Migration Script

See `scripts/upload-images.js` (create this script if needed)

## Step 7: Add Blog Posts to Firestore

### Option A: Using Firebase Console

1. Go to **Firestore Database** in Firebase Console
2. Click "Start collection"
3. Collection ID: `blogPosts`
4. Add documents with the following structure:

**Document 1:**
- Document ID: `1` (or auto-generate)
- Fields:
  - `title` (string): "Building Award-Winning Robots: Lessons from FTC Worlds 2025"
  - `excerpt` (string): "Reflecting on the design process..."
  - `date` (timestamp): March 1, 2025
  - `category` (string): "Robotics"
  - `readTime` (string): "8 min read"
  - `content` (string): HTML content of the blog post

**Document 2:**
- Document ID: `2`
- Fields: (same structure as above)

### Option B: Using Firebase CLI

Create a JSON file `blog-posts.json`:

```json
[
  {
    "title": "Building Award-Winning Robots: Lessons from FTC Worlds 2025",
    "excerpt": "Reflecting on the design process...",
    "date": "2025-03-01",
    "category": "Robotics",
    "readTime": "8 min read",
    "content": "<p>Winning the National Inspire Award...</p>"
  }
]
```

Then import using:
```bash
firebase firestore:import blog-posts.json
```

### Option C: Using a Migration Script

See `scripts/migrate-blogs.js` (create this script if needed)

## Step 8: Test Your Setup

1. Start your development server: `npm run dev`
2. Check the browser console for any Firebase errors
3. Verify images load from Firebase Storage
4. Verify blog posts load from Firestore

## Troubleshooting

### Images not loading
- Check that images are uploaded to the correct path: `images/projects/`
- Verify Firebase Storage rules allow read access
- Check browser console for errors
- Verify Firebase config is correct

### Blog posts not loading
- Check that collection is named `blogPosts` (case-sensitive)
- Verify Firestore rules allow read access
- Check browser console for errors
- Verify document structure matches expected format

### CORS errors
- Firebase Storage should handle CORS automatically
- If issues persist, check Firebase Storage settings

## Security Best Practices

For production, update security rules to be more restrictive:

**Storage Rules:**
```javascript
match /images/{allPaths=**} {
  allow read: if true; // Public read
  allow write: if request.auth != null && request.auth.token.admin == true; // Only admins
}
```

**Firestore Rules:**
```javascript
match /blogPosts/{document=**} {
  allow read: if true; // Public read
  allow write: if request.auth != null && request.auth.token.admin == true; // Only admins
}
```

## Next Steps

- Set up Firebase Authentication for admin access
- Create an admin panel for managing blog posts
- Set up image optimization/compression
- Configure CDN for faster image delivery

