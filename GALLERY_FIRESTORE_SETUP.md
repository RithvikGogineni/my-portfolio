# Gallery Firestore Setup Guide

The gallery now automatically loads sections and images from Firestore. Any folder you create in Firebase Storage under `images/gallery/` can become a gallery section.

## How It Works

1. **Folders in Firebase Storage** = Gallery Sections
   - Each folder in `images/gallery/` becomes a section
   - Example: `images/gallery/blender/` → "Blender" section

2. **Firestore Stores the Structure**
   - Collection: `gallerySections`
   - Each document represents a folder/section
   - Contains folder name, title, description, and list of image filenames

## Step 1: Create Firestore Collection

1. Go to **Firestore Database** in Firebase Console
2. Click "Start collection" (if new) or use existing
3. Collection ID: `gallerySections`

## Step 2: Add Gallery Section Documents

For each folder in `images/gallery/`, create a document:

### Document Structure

**Document ID**: Use the folder name (e.g., `blender`, `robotics`)

**Fields**:
```javascript
{
  id: "blender",                    // Folder name (same as document ID)
  title: "Blender & 3D Design",     // Display title
  description: "3D modeling and renders", // Optional description
  order: 1,                         // Display order (1, 2, 3...)
  images: [                         // Array of image filenames
    "image1.jpg",
    "image2.png",
    "render-3.jpg"
  ]
}
```

### Example: Blender Section

**Document ID**: `blender`

**Fields**:
- `id` (string): `blender`
- `title` (string): `Blender & 3D Design`
- `description` (string): `3D modeling, renders, and visual design work`
- `order` (number): `1`
- `images` (array): 
  ```
  [
    "2d858e8d-1d66-43d9-8cba-41def5677647.JPG",
    "2eaf52b8-d0ac-4859-b87d-44cc0518b410.JPG",
    "IMG_3067.JPG",
    "PHOTO-2023-08-08-00-07-09.jpg",
    // ... all your image filenames
  ]
  ```

## Step 3: Add More Sections

Create a document for each folder:

### Robotics Section
- **Document ID**: `robotics`
- **Fields**:
  - `id`: `robotics`
  - `title`: `Robotics`
  - `description`: `Robot builds and competitions`
  - `order`: `2`
  - `images`: `[array of filenames from images/gallery/robotics/]`

### Competition Section
- **Document ID**: `competition`
- **Fields**:
  - `id`: `competition`
  - `title`: `Competitions`
  - `description`: `Competition moments and achievements`
  - `order`: `3`
  - `images`: `[array of filenames from images/gallery/competition/]`

## Step 4: Update Images Array

When you add new images to a folder:

1. Upload images to Firebase Storage: `images/gallery/{folder-name}/`
2. Go to Firestore
3. Find the section document
4. Update the `images` array field with new filenames
5. Save

## Quick Setup Script

You can use this structure in Firestore Console:

### For Blender Section:
```json
{
  "id": "blender",
  "title": "Blender & 3D Design",
  "description": "3D modeling, renders, and visual design work",
  "order": 1,
  "images": [
    "2d858e8d-1d66-43d9-8cba-41def5677647.JPG",
    "2eaf52b8-d0ac-4859-b87d-44cc0518b410.JPG",
    "43b8739b-9205-4072-bcf8-facb6b1488fe.JPG",
    "4ba1bc90-c730-42b4-8279-36c56cc34e66.JPG",
    "66198834-5bf7-496a-89b5-c9803b73208a.JPG",
    "70c26b65-38e2-4bcf-b5a4-a80acaf708e2.JPG",
    "962fe520-6a66-4472-aff6-0cb63c5b503b.JPG",
    "IMG_3067.JPG",
    "IMG_3068.JPG",
    "IMG_3069.JPG",
    "IMG_3070.JPG",
    "IMG_3076.JPG",
    "IMG_3077.JPG",
    "IMG_3078.JPG",
    "IMG_3079.JPG",
    "IMG_3080.JPG",
    "IMG_3144.JPG",
    "IMG_3145.JPG",
    "IMG_3146.JPG",
    "IMG_3147.JPG",
    "IMG_3148.JPG",
    "IMG_3150.JPG",
    "IMG_3151.JPG",
    "IMG_3152.JPG",
    "IMG_3153.JPG",
    "IMG_3154.JPG",
    "IMG_3155.JPG",
    "IMG_3156.JPG",
    "IMG_3157.JPG",
    "IMG_3158.JPG",
    "IMG_3159.JPG",
    "IMG_3160.JPG",
    "IMG_3161.JPG",
    "PHOTO-2023-08-08-00-07-09.jpg",
    "PHOTO-2023-08-08-00-07-10 2.jpg",
    "PHOTO-2023-08-08-00-07-10.jpg",
    "PHOTO-2023-09-01-14-04-53.jpg",
    "PHOTO-2023-09-01-14-05-13.jpg",
    "PHOTO-2023-09-02-12-31-15.jpg",
    "PHOTO-2023-09-02-12-37-37 2.jpg",
    "PHOTO-2023-09-02-12-37-37.jpg",
    "PHOTO-2024-04-24-15-35-47.jpg",
    "PHOTO-2024-05-01-13-39-14.jpg",
    "PHOTO-2024-09-20-11-56-50.jpg",
    "PHOTO-2024-11-26-13-39-50.jpg",
    "bfb4706a-5dad-432c-ba7e-ba380b1b59dc.JPG",
    "e0c269b7-ef47-4bf0-9c3a-39d2fe2b41f0.JPG",
    "edb665a6-7572-4b81-9843-5282dc33d4a6.JPG",
    "f1804f49-5ca5-4f49-be05-2061d1bc6eb3.JPG",
    "f7533455-a4cc-4906-8443-14bf0d30c1fe.JPG"
  ]
}
```

## Firestore Security Rules

Update your Firestore rules to allow reading gallery sections:

```javascript
match /gallerySections/{document=**} {
  allow read: if true; // Public read
  allow write: if request.auth != null; // Only authenticated users can write
}
```

## Benefits

✅ **Automatic**: Any folder becomes a section  
✅ **Dynamic**: Add/remove sections without code changes  
✅ **Easy Updates**: Just update Firestore when adding images  
✅ **Scalable**: Works with any number of folders and images  

## Troubleshooting

- **No sections showing**: Check that `gallerySections` collection exists in Firestore
- **Images not loading**: Verify filenames in `images` array match exactly what's in Firebase Storage
- **Wrong order**: Check the `order` field - sections are sorted by this number

