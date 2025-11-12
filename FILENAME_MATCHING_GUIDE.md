# Filename Matching Guide

## The Problem

Your Firestore `images` array contains filenames that don't match the actual files in Firebase Storage. Firebase Storage is **case-sensitive**, so `BMW-M4-F22.JPG` is different from `bmw-m4-f22.jpg`.

## How to Fix

### Step 1: Check Actual Filenames in Firebase Storage

1. Go to Firebase Console → Storage
2. Navigate to `images/gallery/blender/`
3. **Write down the EXACT filenames** as they appear (including case)
4. Pay attention to:
   - Capital letters vs lowercase
   - File extensions (.JPG vs .jpg)
   - Spaces, hyphens, underscores

### Step 2: Update Firestore to Match

1. Go to Firestore Database → `gallerySections` → `blender`
2. Open the `images` array
3. **Replace each filename** with the EXACT filename from Firebase Storage
4. Make sure:
   - Case matches exactly
   - Extension matches exactly (.JPG vs .jpg)
   - No extra spaces or characters

### Step 3: Common Issues

**Issue:** Firestore has `BMW-M4-F22.JPG` but Storage has `bmw-m4-f22.jpg`
**Fix:** Change Firestore to `bmw-m4-f22.jpg` (or rename the file in Storage)

**Issue:** Firestore has `IMG_3078.jpg` but Storage has `IMG_3078.JPG`
**Fix:** Change Firestore to `IMG_3078.JPG` (or rename the file in Storage)

**Issue:** Firestore has `Countach-Cherry-Blossom.JPG` but Storage has `countach-cherry-blossom.JPG`
**Fix:** Change Firestore to match Storage exactly

## Quick Fix Option

If you have many mismatches, you can:

1. **Option A:** Rename files in Firebase Storage to match Firestore
   - Click on each file in Storage
   - Use "Rename" option
   - Match the exact case from Firestore

2. **Option B:** Update Firestore to match Storage
   - Copy the exact filenames from Storage
   - Update the `images` array in Firestore

## Verification

After fixing, check the browser console. You should see:
- ✅ No more 404 errors
- ✅ Images loading successfully
- ✅ Gallery displaying images

## Example

**Firebase Storage has:**
```
43b8739b-9205-4072-bcf8-facb6b1488fe.JPG
IMG_3067.JPG
IMG_3068.JPG
```

**Firestore `images` array should be:**
```json
[
  "43b8739b-9205-4072-bcf8-facb6b1488fe.JPG",
  "IMG_3067.JPG",
  "IMG_3068.JPG"
]
```

**NOT:**
```json
[
  "43b8739b-9205-4072-bcf8-facb6b1488fe.jpg",  // ❌ Wrong case
  "img_3067.jpg",  // ❌ Wrong case
  "IMG_3068.JPG"  // ✅ Correct
]
```

