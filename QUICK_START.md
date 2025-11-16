# Kapoor Food India - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Deploy to GitHub Pages

```bash
# Navigate to project folder
cd /home/khushwant/breville-work/projects/personal-projects/kapoor_food_india

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub.com (name: kapoor-food-india)
# Then run (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/kapoor-food-india.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Source: **main** branch
3. Click **Save**
4. Site will be live at: `https://YOUR_USERNAME.github.io/kapoor-food-india/`

### 3. Add Custom Domain (kapoorfoodindia.in)

**GitHub Side:**
- Settings > Pages > Custom domain: `kapoorfoodindia.in`
- Check "Enforce HTTPS"

**DNS Side (at your domain registrar):**

Add 4 A records:
```
@ → 185.199.108.153
@ → 185.199.109.153
@ → 185.199.110.153
@ → 185.199.111.153
```

Add CNAME record:
```
www → YOUR_USERNAME.github.io
```

⏰ Wait 1-24 hours for DNS propagation

### 4. Access Admin Portal

**URL**: `https://kapoorfoodindia.in/admin/`

**Login**:
- Username: `admin`
- Password: `admin123`

⚠️ **Change password** in `/admin/js/admin.js` before going live!

### 5. Update Content

**Essential Updates:**

1. **Contact Info** (Search and replace in all HTML files):
   - `+91 XXXXXXXXXX` → Your phone number
   - `info@kapoorfoodindia.in` → Your email

2. **Add Product Images**:
   ```bash
   # Add images to assets/images/
   cp your-image.jpg assets/images/
   
   # Update products.json
   git add .
   git commit -m "Add product images"
   git push
   ```

3. **Social Media Links** (in footer of all pages):
   - Facebook: Update URL
   - Instagram: Update URL
   - WhatsApp: Update number

## 📋 What You Get

✅ **Complete Website**:
- Homepage with hero section
- About Us page
- Products showcase
- Contact form
- Mobile responsive design

✅ **Admin Portal**:
- Dashboard with statistics
- Product management (Add/Edit/Delete)
- Contact message viewer
- Settings panel
- Data export/import

✅ **Features**:
- JSON-based product system
- Contact form with localStorage
- Responsive navigation
- SEO optimized
- Professional design

## 📁 Project Structure

```
kapoor_food_india/
├── index.html          # Homepage
├── about.html          # About page
├── products.html       # Products page
├── contact.html        # Contact page
├── admin/
│   └── index.html      # Admin portal
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── data/
│   └── products.json   # Product data
└── assets/images/      # Your images here
```

## 🎯 Quick Tasks After Deployment

### Immediately
- [ ] Change admin password
- [ ] Update phone number
- [ ] Update email address
- [ ] Update complete address
- [ ] Add social media links

### Within First Week
- [ ] Add product images
- [ ] Update product descriptions
- [ ] Test contact form
- [ ] Test on mobile devices
- [ ] Set up Google Analytics
- [ ] Submit to Google Search Console

### Ongoing
- [ ] Add new products via admin
- [ ] Check contact messages
- [ ] Update company information
- [ ] Monitor website performance

## 🆘 Common Issues

**Site not loading?**
- Wait for GitHub Pages deployment (1-2 minutes)
- Check Settings > Pages for status

**Custom domain not working?**
- Verify DNS records
- Wait for DNS propagation (up to 24 hours)
- Check CNAME file is present

**Admin portal not working?**
- Clear browser cache
- Check browser console (F12) for errors

## 📞 Need Help?

See detailed guides:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Step-by-step deployment guide

---

**Your website will be live at**: https://kapoorfoodindia.in  
**Admin portal**: https://kapoorfoodindia.in/admin/

Good luck with Kapoor Food India! 🎉
