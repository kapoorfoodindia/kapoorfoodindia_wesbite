# Deployment Guide for Kapoor Food India Website

## Quick Start - Deploy to GitHub Pages

### Prerequisites
- GitHub account
- Git installed on your computer
- Domain: kapoorfoodindia.in (already purchased)

### Step-by-Step Deployment

#### 1. Initialize Git Repository
```bash
cd /home/khushwant/breville-work/projects/personal-projects/kapoor_food_india
git init
git add .
git commit -m "Initial commit: Kapoor Food India website with admin portal"
```

#### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `kapoor-food-india`
3. Description: "Kapoor Food India - Premium Frozen Foods Website"
4. Keep it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

#### 3. Push to GitHub
```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kapoor-food-india.git

# Push code
git branch -M main
git push -u origin main
```

#### 4. Enable GitHub Pages
1. In your GitHub repository, click **Settings**
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment

Your site will be live at: `https://YOUR_USERNAME.github.io/kapoor-food-india/`

#### 5. Configure Custom Domain

##### A. In GitHub:
1. Go to Settings > Pages
2. Under "Custom domain", enter: `kapoorfoodindia.in`
3. Check "Enforce HTTPS" (may take a few minutes to enable)
4. Click Save

##### B. Configure DNS at Domain Registrar:

**For Apex Domain (kapoorfoodindia.in):**

Add these **4 A records**:
```
Type: A
Name: @
TTL: 3600
Value: 185.199.108.153

Type: A
Name: @
TTL: 3600
Value: 185.199.109.153

Type: A
Name: @
TTL: 3600
Value: 185.199.110.153

Type: A
Name: @
TTL: 3600
Value: 185.199.111.153
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
TTL: 3600
Value: YOUR_USERNAME.github.io.
```

⏰ **DNS propagation takes 1-24 hours**

#### 6. Verify Deployment

After DNS propagation:
- Visit: https://kapoorfoodindia.in
- Visit: https://www.kapoorfoodindia.in
- Admin: https://kapoorfoodindia.in/admin/

## Admin Portal Setup

### First-Time Setup

1. Visit: `https://kapoorfoodindia.in/admin/`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

### Change Admin Password

Edit `/admin/js/admin.js` and update:

```javascript
const defaultCredentials = {
    username: 'admin',
    password: 'YOUR_NEW_PASSWORD'  // Change this!
};
```

Commit and push changes:
```bash
git add admin/js/admin.js
git commit -m "Update admin credentials"
git push
```

## Managing Content

### Method 1: Using Admin Portal (Quick Updates)

**Note**: Changes via admin portal are stored in browser localStorage and won't persist across devices.

1. Login to admin portal
2. Make changes (add/edit/delete products)
3. Export data (Settings > Data Management > Export Data)
4. Update `data/products.json` with exported data
5. Commit and push:

```bash
git add data/products.json
git commit -m "Update products"
git push
```

### Method 2: Direct File Editing (Recommended for Production)

1. Edit `data/products.json` locally:

```json
{
  "products": [
    {
      "id": 1,
      "name": "New Product",
      "description": "Description here",
      "category": "Vegetables",
      "features": ["Feature 1", "Feature 2"],
      "available": true,
      "image": "assets/images/product.jpg"
    }
  ],
  "lastUpdated": "2024-11-16"
}
```

2. Commit and push:

```bash
git add data/products.json
git commit -m "Add new product"
git push
```

3. Changes will be live in 1-2 minutes

## Adding Product Images

### Step 1: Prepare Images
- Format: JPG or PNG
- Recommended size: 800x600px
- Optimize images (use TinyPNG or similar)
- Name: `frozen-peas.jpg`, `frozen-corn.jpg`, etc.

### Step 2: Add to Repository

```bash
# Create images directory
mkdir -p assets/images

# Add your images
cp ~/Downloads/frozen-peas.jpg assets/images/
cp ~/Downloads/frozen-corn.jpg assets/images/
cp ~/Downloads/mix-veg.jpg assets/images/

# Commit and push
git add assets/images/
git commit -m "Add product images"
git push
```

### Step 3: Update products.json

```json
{
  "id": 1,
  "name": "Frozen Green Peas",
  "image": "assets/images/frozen-peas.jpg",
  ...
}
```

## Updating Website Content

### Contact Information

Edit these files:
- `index.html`
- `about.html`
- `products.html`
- `contact.html`

Search for `+91 XXXXXXXXXX` and `info@kapoorfoodindia.in` and replace with actual details.

### Social Media Links

Find and update in footer sections:
```html
<a href="https://facebook.com/YOUR_PAGE" aria-label="Facebook">
<a href="https://instagram.com/YOUR_HANDLE" aria-label="Instagram">
```

### Company Address

Update in footer and contact page:
```html
<li><i class="fas fa-map-marker-alt"></i> Your Complete Address, Lucknow, UP</li>
```

## Troubleshooting

### Site Not Loading

1. Check GitHub Pages status: Settings > Pages
2. Verify DNS settings (use https://dnschecker.org)
3. Clear browser cache
4. Wait for DNS propagation (up to 24 hours)

### Admin Portal Not Working

1. Clear browser localStorage
2. Check browser console for errors (F12)
3. Verify paths are correct (no `/admin` in CNAME)

### Custom Domain Not Working

1. Verify CNAME file contains: `kapoorfoodindia.in`
2. Check DNS records are correct
3. Wait for DNS propagation
4. Try without www: https://kapoorfoodindia.in

### HTTPS Not Available

1. Wait 15-30 minutes after adding custom domain
2. Toggle "Enforce HTTPS" off and on
3. Remove and re-add custom domain if needed

## Making Updates

### Quick Updates (Text/Content)

```bash
# 1. Edit files locally
nano index.html  # or use any editor

# 2. Commit changes
git add .
git commit -m "Update homepage content"
git push

# 3. Wait 1-2 minutes for deployment
```

### Adding New Pages

```bash
# 1. Create new HTML file
cp about.html new-page.html

# 2. Edit content
nano new-page.html

# 3. Add navigation link in all pages
# Edit index.html, about.html, etc. to add link

# 4. Commit and push
git add .
git commit -m "Add new page"
git push
```

## Performance Optimization

### Image Optimization
- Use WebP format for better compression
- Lazy load images: `loading="lazy"`
- Use responsive images: `<picture>` element

### Caching
GitHub Pages automatically caches files. To force reload:
- Update filename with version: `style-v2.css`
- Or add query string: `style.css?v=2`

### Monitoring

Use these tools:
- Google Search Console
- Google Analytics
- Lighthouse (Chrome DevTools)

## Backup

### Regular Backups

```bash
# Backup repository
git clone https://github.com/YOUR_USERNAME/kapoor-food-india.git backup-$(date +%Y%m%d)

# Export admin data
# Use Admin Portal > Settings > Export Data
```

## Support Resources

- **GitHub Pages Docs**: https://docs.github.com/pages
- **Custom Domain Help**: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
- **Git Tutorial**: https://git-scm.com/docs/gittutorial

## Next Steps

After deployment:

1. ✅ Test all pages on different devices
2. ✅ Update contact information
3. ✅ Add real product images
4. ✅ Change admin password
5. ✅ Set up Google Analytics
6. ✅ Submit to Google Search Console
7. ✅ Create social media accounts
8. ✅ Test contact form
9. ✅ Verify custom domain HTTPS
10. ✅ Share website with customers!

---

**Need Help?**
- GitHub Issues: Create an issue in your repository
- Email: info@kapoorfoodindia.in

**Website**: https://kapoorfoodindia.in  
**Admin Portal**: https://kapoorfoodindia.in/admin/
