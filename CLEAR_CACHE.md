# How to Clear Blog Cache

If you've updated blog posts in Firestore but they're not showing up, the cache might be holding old data.

## Quick Fix: Clear Browser Cache

### Option 1: Hard Refresh (Fastest)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

This will force the browser to reload everything and fetch fresh data from Firestore.

### Option 2: Clear localStorage
1. Open browser DevTools (F12 or right-click → Inspect)
2. Go to **Console** tab
3. Type this command and press Enter:
   ```javascript
   localStorage.removeItem('firebase_blog_posts')
   ```
4. Refresh the page (F5)

### Option 3: Clear All Site Data
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → your site URL
4. Right-click and select **Clear** or delete the `firebase_blog_posts` entry
5. Refresh the page

## Cache Duration

Blog posts are now cached for **5 minutes** (reduced from 1 hour) for faster updates.

This means:
- Updates will appear within 5 minutes automatically
- Or use the methods above to see updates immediately

## For Development

If you're actively editing blog posts and want instant updates, you can:

1. **Disable cache in DevTools**:
   - Open DevTools (F12)
   - Go to **Network** tab
   - Check "Disable cache"
   - Keep DevTools open while testing

2. **Use Incognito/Private mode**:
   - Opens with no cached data
   - Good for testing fresh loads

## Automatic Refresh

The cache will automatically refresh after 5 minutes, so your updates will appear without any action needed.

