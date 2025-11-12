# Firestore Gallery Setup - Quick Guide

Since you have all your image metadata in `blenderimages.json`, here's exactly what to do in Firestore:

## Step 1: Create the Collection

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** in the left sidebar
4. Click **"Start collection"** (if it's a new database) or click **"Add collection"**
5. Collection ID: `gallerySections`
6. Click **"Next"**

## Step 2: Add the Blender Section Document

### Option A: Manual Entry (Step-by-Step)

1. **Document ID**: `blender` (this must match your folder name in Firebase Storage)

2. **Add these fields** (click "Add field" for each):

   - **Field 1**: `id` → Type: **string** → Value: `blender`
   - **Field 2**: `title` → Type: **string** → Value: `Blender & 3D Design`
   - **Field 3**: `description` → Type: **string** → Value: `3D modeling, renders, and visual design work`
   - **Field 4**: `order` → Type: **number** → Value: `1`
   - **Field 5**: `images` → Type: **array** → Click array icon, then add each filename as a string item

3. **For the `images` array**, add these 42 filenames (one by one, or copy-paste):
   - See `FIRESTORE_BLENDER_DOCUMENT.json` for the complete list

4. Click **"Save"**

### Option B: Import JSON (Easier!)

1. Open `FIRESTORE_BLENDER_DOCUMENT.json` in your project
2. Copy the entire JSON content
3. In Firestore Console:
   - Create collection: `gallerySections`
   - Click "Add document"
   - **Document ID**: `blender`
   - Click the "Import JSON" button (if available) OR manually paste the field values
   - For the `images` array, you can paste the array directly

**Note**: Firestore Console doesn't have a direct "Import JSON" button, but you can:
- Copy the JSON structure
- Manually create each field matching the JSON structure
- For the `images` array, add each filename as a separate array item

## Step 3: Verify Your Document Structure

Your document should look like this:

```
Document ID: blender
├── id: "blender" (string)
├── title: "Blender & 3D Design" (string)
├── description: "3D modeling, renders, and visual design work" (string)
├── order: 1 (number)
└── images: [array with 42 items]
    ├── "43b8739b-9205-4072-bcf8-facb6b1488fe.JPG"
    ├── "bfb4706a-5dad-432c-ba7e-ba380b1b59dc.JPG"
    ├── "BMW-M4-F22.JPG"
    └── ... (all other filenames)
```

## Important Notes

✅ **Filenames must match exactly** - Case sensitive, including file extensions (.JPG vs .jpg)

✅ **The `blenderimages.json` file is already in your code** - The component will automatically load titles and descriptions from it

✅ **Document ID = Folder Name** - The document ID (`blender`) must match your Firebase Storage folder name (`images/gallery/blender/`)

## Adding More Sections Later

When you add more folders (like `robotics`, `competition`, etc.):

1. Create a new document in `gallerySections` collection
2. Document ID = folder name (e.g., `robotics`)
3. Add the same fields: `id`, `title`, `description`, `order`, `images`
4. Add image filenames to the `images` array

## Firestore Security Rules

Make sure your Firestore rules allow reading:

```javascript
match /gallerySections/{document=**} {
  allow read: if true; // Public read
  allow write: if request.auth != null; // Only authenticated users can write
}
```

## That's It!

Once you save the document, your gallery will automatically:
- Load the section from Firestore
- Display all images from the `images` array
- Show titles and descriptions from `blenderimages.json` when clicked

