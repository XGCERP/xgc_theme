# Media Integration Quick Start

## What You Have

Your `/public/media/` directory contains:
- ✅ **Logos** - Brand logos in multiple sizes and formats
- ✅ **Favicons** - Complete favicon set for all devices
- ✅ **Banners** - 30+ images for news/blog posts
- ✅ **Sliders** - 5 hero slider images
- ✅ **Team Photos** - Team member photos
- ✅ **Partner Logos** - AWS, Cardano, Ontario, etc.
- ✅ **Error Pages** - 404 SVG illustration

## What's Already Done

I've made these changes to your theme:

### 1. Favicon Configured ✅
**File**: `hooks.py`
- Favicon will now appear in browser tabs
- Splash image configured for mobile

### 2. Logo Styling Added ✅
**Files**: `xgc_desk.css`, `xgc_website.css`
- Desk sidebar logo styling ready
- Website header logo styling ready
- Responsive sizing included

## Quick Implementation (5 Minutes)

### Step 1: Build and Test Favicon

```bash
cd /path/to/frappe-bench
bench build --app xgc_theme
bench clear-cache
```

Open your browser and check if the favicon appears in the tab.

### Step 2: Add Logo to Desk Sidebar

Find your Desk sidebar template (usually in Frappe core or custom app) and add:

```html
<div class="sidebar-logo">
    <img src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png" 
         alt="XGC Carbon"
         loading="eager">
</div>
```

Place this at the top of the sidebar, before the navigation items.

### Step 3: Add Logo to Website Header

Find your website header template and update the navbar-brand:

```html
<a href="/" class="navbar-brand">
    <img src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png" 
         alt="XGC Carbon"
         loading="eager">
</a>
```

### Step 4: Test

1. Refresh your Frappe instance
2. Check Desk interface - logo should appear in sidebar
3. Check Website - logo should appear in header
4. Test on mobile - logo should scale appropriately
5. Switch to dark theme - logo should still be visible

## Next: Hero Slider (15 Minutes)

Want to add the hero slider? Here's the quick version:

### 1. Create HTML

```html
<div class="hero-slider">
    <div class="hero-slide hero-slide-1 active">
        <div class="hero-content">
            <h1>Welcome to XGC Carbon</h1>
            <p>Leading the future of carbon credit trading</p>
            <a href="/about" class="btn btn-primary">Learn More</a>
        </div>
    </div>
    <div class="hero-slide hero-slide-2">
        <div class="hero-content">
            <h1>Sustainable Solutions</h1>
            <p>Building a greener tomorrow</p>
            <a href="/solutions" class="btn btn-primary">Explore</a>
        </div>
    </div>
    <!-- Add slides 3, 4, 5 similarly -->
</div>
```

### 2. Add CSS

Create `xgc_theme/public/css/xgc_hero.css`:

```css
.hero-slider {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
}

.hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
    background-size: cover;
    background-position: center;
}

.hero-slide.active {
    opacity: 1;
}

.hero-slide-1 {
    background-image: url('/assets/xgc_theme/media/sliders/xgc_slide1.webp');
}

.hero-slide-2 {
    background-image: url('/assets/xgc_theme/media/sliders/xgc_slide2.webp');
}

.hero-slide-3 {
    background-image: url('/assets/xgc_theme/media/sliders/xgc_slide3.webp');
}

.hero-slide-4 {
    background-image: url('/assets/xgc_theme/media/sliders/xgc_slide4.webp');
}

.hero-slide-5 {
    background-image: url('/assets/xgc_theme/media/sliders/xgc_slide5.webp');
}

.hero-content {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
}

.hero-content h1 {
    color: white;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.hero-content p {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
```

### 3. Add JavaScript

In `xgc_theme/public/js/xgc_theme.js`, add:

```javascript
function setup_hero_slider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    showSlide(0);
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Call in your init function
frappe.ready(function() {
    setup_hero_slider();
});
```

### 4. Register CSS

In `hooks.py`, add to `web_include_css`:

```python
web_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_website.css",
    "/assets/xgc_theme/css/xgc_hero.css"  # ADD THIS
]
```

### 5. Build and Test

```bash
bench build --app xgc_theme
bench clear-cache
```

Visit your homepage - you should see the hero slider!

## Next: Partner Logos (10 Minutes)

### 1. Add HTML to Homepage

```html
<section class="partners-section">
    <div class="container">
        <h2 class="text-center mb-5">Our Partners</h2>
        <div class="partners-grid">
            <img src="/assets/xgc_theme/media/partners/aws-80x180.png" alt="AWS" class="partner-logo">
            <img src="/assets/xgc_theme/media/partners/cardano-logo-blue.png" alt="Cardano" class="partner-logo">
            <img src="/assets/xgc_theme/media/partners/mars_80x80.png" alt="MaRS" class="partner-logo">
            <img src="/assets/xgc_theme/media/partners/ontario-80x180.png" alt="Ontario" class="partner-logo">
            <img src="/assets/xgc_theme/media/partners/edc-80x180.png" alt="EDC" class="partner-logo">
            <img src="/assets/xgc_theme/media/partners/gcs-80x180.png" alt="GCS" class="partner-logo">
        </div>
    </div>
</section>
```

### 2. Add CSS

In `xgc_website.css`, add:

```css
.partners-section {
    padding: 4rem 0;
    background-color: var(--surface-color);
}

.partners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    align-items: center;
    justify-items: center;
}

.partner-logo {
    max-width: 180px;
    height: 80px;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
}

.partner-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
}
```

### 3. Build and Test

```bash
bench build --app xgc_theme
```

## Full Documentation

For complete implementation details, see:
- **`MEDIA_INTEGRATION_GUIDE.md`** - Comprehensive guide with all features
- **`MEDIA_INTEGRATION_SUMMARY.md`** - Summary of what's available

## File Paths

All media is accessible via:
```
/assets/xgc_theme/media/{category}/{filename}
```

Examples:
- Logo: `/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png`
- Slider: `/assets/xgc_theme/media/sliders/xgc_slide1.webp`
- Partner: `/assets/xgc_theme/media/partners/aws-80x180.png`
- Banner: `/assets/xgc_theme/media/banners/carbon-market-img1.png`

## Troubleshooting

**Images don't load?**
- Check file path is correct
- Run `bench build --app xgc_theme`
- Run `bench clear-cache`
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

**Logo too big/small?**
- Adjust height in CSS
- Use different size variant (h100 vs h400)

**Slider doesn't work?**
- Check JavaScript console for errors
- Verify all 5 slides have the correct class names
- Ensure xgc_hero.css is loaded

## Need Help?

1. Check browser console for errors
2. Verify file paths are correct
3. Ensure assets are built: `bench build --app xgc_theme`
4. Clear cache: `bench clear-cache`
5. Review full guide: `MEDIA_INTEGRATION_GUIDE.md`

## Summary

You now have:
- ✅ Favicon configured
- ✅ Logo styling ready
- ✅ Hero slider code ready
- ✅ Partner logos code ready
- ✅ 30+ banners ready to use
- ✅ Team photos ready to use
- ✅ Complete documentation

**Start with the favicon and logo, then add the hero slider and partner logos. You'll have a professional-looking site in under 30 minutes!**
