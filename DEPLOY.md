# Deploying to GitHub

## Option 1: Using GitHub Website (Easiest)

1. Go to https://github.com/new
2. Create a new repository:
   - Repository name: `portfolio` (or any name you prefer)
   - Description: "Rithvik Gogineni - Robotics Innovator & STEM Leader Portfolio"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"
4. Then run these commands in your terminal:

```bash
cd /Users/rithvik/Downloads/portfolio-2/my-portfolio
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Option 2: Using GitHub CLI (if you install it)

```bash
# Install GitHub CLI first: brew install gh
gh auth login
gh repo create portfolio --public --source=. --remote=origin --push
```

## After Pushing

Your code will be on GitHub! You can then:
- Deploy to Vercel, Netlify, or GitHub Pages
- Share the repository link
- Continue development with version control

