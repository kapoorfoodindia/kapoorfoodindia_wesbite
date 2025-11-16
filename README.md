# Kapoor Food India Website

A professional static website for Kapoor Food India - Premium frozen foods from Lucknow.

## 🌟 Features

- **Modern & Responsive Design**: Mobile-first design that works on all devices
- **Dynamic Product Management**: JSON-based product system for easy updates
- **Admin Portal**: Full-featured admin panel for managing products and content
- **Contact Form**: Built-in contact form with message management
- **SEO Optimized**: Semantic HTML and meta tags for better search visibility
- **Fast Loading**: Optimized static assets for quick page loads

## 📁 Project Structure

```
kapoor_food_india/
├── index.html              # Homepage
├── about.html              # About Us page
├── products.html           # Products listing page
├── contact.html            # Contact page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript
│   ├── products.js        # Products loading logic
│   └── contact.js         # Contact form handling
├── data/
│   └── products.json      # Products data
├── admin/
│   ├── index.html         # Admin portal
│   ├── css/
│   │   └── admin.css      # Admin styles
│   └── js/
│       └── admin.js       # Admin functionality
└── assets/
    └── images/            # Image assets
```

## 🚀 Deployment on GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `kapoor-food-india` (or any name you prefer)
3. Keep it public (required for free GitHub Pages)

### Step 2: Push Code to GitHub

```bash
cd /home/khushwant/breville-work/projects/personal-projects/kapoor_food_india

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Kapoor Food India website"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kapoor-food-india.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Your site will be published at: `https://YOUR_USERNAME.github.io/kapoor-food-india/`

### Step 4: Configure Custom Domain (kapoorfoodindia.in)

1. In GitHub repository Settings > Pages, enter your custom domain: `kapoorfoodindia.in`
2. Check "Enforce HTTPS"
3. Add the following DNS records at your domain registrar:

#### DNS Records for Custom Domain:

**A Records (for apex domain):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A  
Name: @
Value: 185.199.111.153
```

**CNAME Record (for www subdomain):**
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

4. DNS changes may take up to 24-48 hours to propagate

## 🔐 Admin Portal Access

### Accessing the Admin Portal

Visit: `https://kapoorfoodindia.in/admin/` (or `https://YOUR_USERNAME.github.io/kapoor-food-india/admin/`)

### Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production by modifying `/admin/js/admin.js`

### Admin Portal Features

1. **Dashboard**: Overview of products, messages, and stats
2. **Products Management**: 
   - Add new products
   - Edit existing products
   - Delete products
   - Toggle availability status
3. **Contact Messages**: View and manage customer inquiries
4. **Settings**: Configure website information
5. **Data Export**: Backup your data

## 📝 Managing Content

### Adding/Editing Products

**Option 1: Using Admin Portal (Recommended)**
1. Login to admin portal
2. Go to Products section
3. Click "Add New Product"
4. Fill in product details and save

**Option 2: Editing JSON Directly**
1. Open `data/products.json`
2. Add or modify product entries
3. Commit and push changes to GitHub

```json
{
  "id": 4,
  "name": "Product Name",
  "description": "Product description",
  "image": "assets/images/product.jpg",
  "category": "Vegetables",
  "features": [
    "Feature 1",
    "Feature 2"
  ],
  "available": true
}
```

### Important Notes for GitHub Pages

1. **Admin Changes**: Changes made through the admin portal are stored in localStorage. To persist them:
   - Export data from admin panel
   - Update `data/products.json` manually
   - Commit and push to GitHub

2. **Alternative**: For dynamic content management, consider using:
   - GitHub Actions to update JSON files
   - Netlify CMS
   - A headless CMS like Strapi or Contentful

## 🛠️ Local Development

To test locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have it)
npx serve

# Then visit: http://localhost:8000
```

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## 🎨 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2d7a3e;
    --secondary-color: #ff9800;
    /* Add your custom colors */
}
```

### Logo & Images

1. Add your logo to `assets/images/`
2. Update references in HTML files
3. Replace placeholder images with actual product photos

## 📧 Contact Form

The contact form stores submissions in localStorage. To receive emails:

1. **Option 1**: Use a service like [Formspree](https://formspree.io/) or [Netlify Forms](https://www.netlify.com/products/forms/)
2. **Option 2**: Set up a serverless function (AWS Lambda, Vercel Functions)
3. **Option 3**: Use Google Apps Script to send emails

## 🔒 Security Notes

1. Change default admin credentials before going live
2. Consider implementing proper authentication for production
3. Use environment variables for sensitive data
4. Enable HTTPS (automatic with GitHub Pages custom domain)

## 📞 Support

For questions or issues:
- Website: [kapoorfoodindia.in](https://kapoorfoodindia.in)
- Email: info@kapoorfoodindia.in

## 📄 License

© 2024 Kapoor Food India. All rights reserved.

---

**Built with ❤️ for Kapoor Food India, Lucknow**
