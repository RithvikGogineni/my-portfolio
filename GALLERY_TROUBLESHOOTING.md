# Gallery Troubleshooting Guide

If your gallery is showing blank, check these steps:

## Step 1: Check Firestore `images` Array

The `images` array in your Firestore document must contain **ALL** the image filenames, not just one.

1. Go to Firebase Console → Firestore Database
2. Open the `gallerySections` collection
3. Click on the `blender` document
4. Find the `images` field (it should be an array)
5. Make sure it contains **all 42 filenames** from `FIRESTORE_BLENDER_DOCUMENT.json`

**Current Status:** Your screenshot shows only one filename in the array. You need to add all of them.

### How to Add All Filenames:

1. In Firestore, click on the `images` field
2. Click the "+" button to add more array items
3. Add each filename as a separate string item
4. Or, you can copy the entire array from `FIRESTORE_BLENDER_DOCUMENT.json` and paste it (Firestore will parse it)

## Step 2: Upload Images to Firebase Storage

The filenames in Firestore are just references. You must also upload the actual image files.

1. Go to Firebase Console → Storage
2. Navigate to or create the folder: `images/gallery/blender/`
3. Upload all your image files to this folder
4. **Important:** The filenames must match EXACTLY (case-sensitive) with what's in Firestore

### Example:
- Firestore has: `"43b8739b-9205-4072-bcf8-facb6b1488fe.JPG"`
- Firebase Storage must have: `images/gallery/blender/43b8739b-9205-4072-bcf8-facb6b1488fe.JPG`

## Step 3: Check Browser Console

Open your browser's developer console (F12) and look for:
- Any errors about missing images
- Console logs showing the number of images loaded
- Firebase Storage errors

## Step 4: Verify the Setup

After completing steps 1 and 2, refresh your gallery page. You should see:
- The section tab "Blender & 3D Design"
- All your images displayed in a grid
- Clicking an image shows the detail panel with title and description

## Quick Checklist

- [ ] Firestore `images` array contains all 42 filenames
- [ ] All image files uploaded to `images/gallery/blender/` in Firebase Storage
- [ ] Filenames match exactly (case-sensitive)
- [ ] Browser console shows no errors
- [ ] Gallery page refreshed after changes

## Still Not Working?

1. Check the browser console for specific error messages
2. Verify Firebase Storage rules allow public read access
3. Make sure your Firebase config is correct in `src/config/firebase.js`
4. Try clearing browser cache and localStorage

