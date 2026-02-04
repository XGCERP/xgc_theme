# Media Assets Integration Guide

## Overview

This guide provides recommendations for integrating the media assets located in `xgc_theme/public/media/` into the XGC Theme for Frappe/ERPNext.

## Available Media Assets

### 1. Logos (`/media/logo/`)
- **Primary Logo**: `xgc_carbon_wide.webp` / `xgc_carbon_wide.png`
- **High-res variants**: `xgc_carbon_wide-h100.png`, `xgc_carbon_wide-h400.webp`
- **Square logos**: `xgc-carbon-logo-sq.webp`, `xgc-carbon-gold-logo-sq.png`
- **Check logo**: `xgc_check_logo.webp`

### 2. Favicons (`/media/favicons/`)
- Complete favicon set for all devices and browsers
- Includes: favicon.ico, apple-touch-icon.png, android-chrome icons, site.webmanifest

### 3. Banners (`/media/banners/`)
- 30+ banner images for news, articles, and hero sections
- Topics: carbon credits, sustainability, blockchain, marketplace
- Formats: PNG, WebP, JPG

### 4. Sliders (`/media/sliders/`)
- 5 slider images: `xgc_slide1.webp` through `xgc_slide5.webp`
- Background: `xgc-vibe-bg.webp`

### 5. Team Photos (`/media/team/`)
- Team member photos for about/team pages
- Various formats: JPEG, WebP, PNG

### 6. Partner Logos (`/media/partners/`)
- AWS, Cardano, Ontario, EDC, GCS, MaRS, and more
- Standardized sizes (80x180, 80x80)

### 7. Photos (`/media/photos/`)
- General purpose images: coins, technology, reforestation

### 8. Error Pages (`/media/`)
- `404 Error.svg` for 404 error page

---

## Integration Recommendations

### Priority 1: Essential Branding (Immediate)

#### 1.1 Update Favicon Configuration

**File**: `xgc_theme/hooks.py`

Add favicon configuration:

```python
# Website Settings
# ----------------
website_context = {
    "favicon": "/assets/xgc_theme/media/favicons/favicon.ico",
    "splash_image": "/assets/xgc_theme/media/logo/xgc-carbon-logo-sq.webp"
}
```

**File**: Create `xgc_theme/public/site.webmanifest` (copy from favicons folder)

```json
{
  "name": "XGC Carbon",
  "short_name": "XGC",
  "icons": [
    {
      "src": "/assets/xgc_theme/media/favicons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/xgc_theme/media/favicons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#2d5016",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

#### 1.2 Add Logo to Desk Sidebar

**File**: `xgc_theme/public/css/xgc_desk.css`

Add logo styling:

```css
/* ===== Desk Sidebar Logo ===== */
.desk-sidebar .sidebar-logo {
    padding: var(--spacing-lg);
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.desk-sidebar .sidebar-logo img {
    max-width: 180px;
    height: auto;
}

/* Logo for light backgrounds */
.desk-sidebar .logo-light {
    content: url('/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png');
}

/* Logo for dark backgrounds */
[data-theme="dark"] .desk-sidebar .logo-dark {
    content: url('/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png');
    filter: brightness(1.2);
}
```

#### 1.3 Add Logo to Website Header

**File**: `xgc_theme/public/css/xgc_website.css`

Add website logo styling:

```css
/* ===== Website Header Logo ===== */
.web-header .navbar-brand {
    display: flex;
    align-items: center;
}

.web-header .navbar-brand img {
    height: 40px;
    width: auto;
    margin-right: var(--spacing-sm);
}

/* Responsive logo sizing */
@media (max-width: 767px) {
    .web-header .navbar-brand img {
        height: 32px;
    }
}

@media (min-width: 1024px) {
    .web-header .navbar-brand img {
        height: 48px;
    }
}
```

**Usage in templates**:
```html
<div class="navbar-brand">
    <img src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png" 
         alt="XGC Carbon" 
         loading="eager">
</div>
```

---

### Priority 2: Website Enhancements (High Priority)

#### 2.1 Hero Section with Slider

**File**: Create `xgc_theme/public/css/xgc_hero.css`

```css
/* ===== Hero Slider ===== */
.hero-slider {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
    background-color: var(--surface-color);
}

.hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--transition-slow);
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

/* Hero content overlay */
.hero-content {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: var(--spacing-xl);
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3),
        rgba(0, 0, 0, 0.5)
    );
}

.hero-content h1 {
    color: white;
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-md);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
    color: white;
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Responsive hero */
@media (max-width: 767px) {
    .hero-slider {
        height: 400px;
    }
    
    .hero-content h1 {
        font-size: var(--font-size-2xl);
    }
    
    .hero-content p {
        font-size: var(--font-size-lg);
    }
}
```

**File**: `xgc_theme/public/js/xgc_theme.js`

Add slider functionality:

```javascript
// Hero Slider
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
    
    // Show first slide
    showSlide(0);
    
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}
```

#### 2.2 Partner Logos Section

**File**: `xgc_theme/public/css/xgc_website.css`

Add partner section styling:

```css
/* ===== Partners Section ===== */
.partners-section {
    padding: var(--spacing-3xl) 0;
    background-color: var(--surface-color);
}

.partners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-xl);
    align-items: center;
    justify-items: center;
}

.partner-logo {
    max-width: 180px;
    height: 80px;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all var(--transition-base);
}

.partner-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
}

/* Dark theme adjustments */
[data-theme="dark"] .partner-logo {
    filter: grayscale(100%) brightness(1.2);
}

[data-theme="dark"] .partner-logo:hover {
    filter: grayscale(0%) brightness(1);
}
```

**HTML Template Example**:
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

#### 2.3 Team Section

**File**: `xgc_theme/public/css/xgc_website.css`

Add team section styling:

```css
/* ===== Team Section ===== */
.team-section {
    padding: var(--spacing-3xl) 0;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
}

.team-member {
    text-align: center;
    padding: var(--spacing-lg);
    background-color: var(--bg-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
}

.team-member:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.team-member-photo {
    width: 150px;
    height: 150px;
    border-radius: var(--border-radius-full);
    object-fit: cover;
    margin: 0 auto var(--spacing-md);
    border: 4px solid var(--xgc-forest-green);
}

.team-member-name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--xgc-forest-green);
    margin-bottom: var(--spacing-xs);
}

.team-member-role {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    margin-bottom: var(--spacing-sm);
}

.team-member-bio {
    font-size: var(--font-size-sm);
    color: var(--text-color);
    line-height: var(--line-height-relaxed);
}
```

#### 2.4 Blog/News Cards with Banners

**File**: `xgc_theme/public/css/xgc_website.css`

Add blog card styling:

```css
/* ===== Blog/News Cards ===== */
.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-xl);
}

.blog-card {
    background-color: var(--bg-color);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
}

.blog-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.blog-card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.blog-card-content {
    padding: var(--spacing-lg);
}

.blog-card-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--xgc-forest-green);
    margin-bottom: var(--spacing-sm);
}

.blog-card-title a {
    color: inherit;
    text-decoration: none;
    transition: color var(--transition-fast);
}

.blog-card-title a:hover {
    color: var(--xgc-gold);
}

.blog-card-excerpt {
    font-size: var(--font-size-base);
    color: var(--text-color);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-md);
}

.blog-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
    color: var(--text-muted);
}

.blog-card-date {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.blog-card-read-more {
    color: var(--xgc-forest-green);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.blog-card-read-more:hover {
    color: var(--xgc-gold);
}
```

**Usage Example**:
```html
<div class="blog-grid">
    <article class="blog-card">
        <img src="/assets/xgc_theme/media/banners/carbon-market-img1.png" 
             alt="Carbon Market" 
             class="blog-card-image">
        <div class="blog-card-content">
            <h3 class="blog-card-title">
                <a href="/blog/carbon-market">Understanding Carbon Markets</a>
            </h3>
            <p class="blog-card-excerpt">
                Explore the fundamentals of carbon credit trading...
            </p>
            <div class="blog-card-meta">
                <span class="blog-card-date">January 15, 2026</span>
                <a href="/blog/carbon-market" class="blog-card-read-more">
                    Read More →
                </a>
            </div>
        </div>
    </article>
</div>
```

---

### Priority 3: Error Pages (Medium Priority)

#### 3.1 Custom 404 Error Page

**File**: Create `xgc_theme/templates/pages/404.html`

```html
{% extends "templates/web.html" %}

{% block title %}Page Not Found{% endblock %}

{% block page_content %}
<div class="error-page-container">
    <div class="error-content">
        <img src="/assets/xgc_theme/media/404 Error.svg" 
             alt="404 Error" 
             class="error-image">
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-message">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="error-actions">
            <a href="/" class="btn btn-primary">Go Home</a>
            <a href="/contact" class="btn btn-secondary">Contact Support</a>
        </div>
    </div>
</div>
{% endblock %}
```

**File**: `xgc_theme/public/css/xgc_website.css`

Add error page styling:

```css
/* ===== Error Pages ===== */
.error-page-container {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
}

.error-content {
    text-align: center;
    max-width: 600px;
}

.error-image {
    max-width: 400px;
    width: 100%;
    height: auto;
    margin-bottom: var(--spacing-xl);
}

.error-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--xgc-forest-green);
    margin-bottom: var(--spacing-md);
}

.error-message {
    font-size: var(--font-size-lg);
    color: var(--text-muted);
    margin-bottom: var(--spacing-xl);
}

.error-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
}
```

---

### Priority 4: Performance Optimizations (Ongoing)

#### 4.1 Image Optimization Strategy

**Recommendations**:

1. **Use WebP format** where available (already present for many images)
2. **Implement lazy loading** for images below the fold
3. **Use responsive images** with srcset
4. **Optimize image sizes** for different viewports

**Example Implementation**:

```html
<!-- Responsive logo with WebP support -->
<picture>
    <source 
        srcset="/assets/xgc_theme/media/logo/xgc_carbon_wide-h400.webp" 
        type="image/webp">
    <img 
        src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h400.png" 
        alt="XGC Carbon"
        loading="lazy"
        width="400"
        height="100">
</picture>

<!-- Responsive banner with multiple sizes -->
<picture>
    <source 
        media="(max-width: 767px)" 
        srcset="/assets/xgc_theme/media/banners/carbon-market-img1.png"
        type="image/png">
    <source 
        media="(min-width: 768px)" 
        srcset="/assets/xgc_theme/media/banners/carbon-market-img1.png"
        type="image/png">
    <img 
        src="/assets/xgc_theme/media/banners/carbon-market-img1.png" 
        alt="Carbon Market"
        loading="lazy"
        class="blog-card-image">
</picture>
```

#### 4.2 Preload Critical Images

**File**: Add to `xgc_theme/hooks.py`

```python
# Add to head for critical images
app_include_head = [
    '<link rel="preload" href="/assets/xgc_theme/media/logo/xgc_carbon_wide-h100.png" as="image">',
    '<link rel="preload" href="/assets/xgc_theme/media/favicons/favicon.ico" as="image">',
]
```

---

## Implementation Checklist

### Phase 1: Essential Branding (Week 1)
- [ ] Configure favicons in hooks.py
- [ ] Add logo to Desk sidebar
- [ ] Add logo to Website header
- [ ] Test logo display in both themes (light/dark)
- [ ] Verify favicon appears in browser tabs

### Phase 2: Website Enhancements (Week 2)
- [ ] Implement hero slider with 5 slides
- [ ] Add partner logos section
- [ ] Create team member cards
- [ ] Style blog/news cards with banners
- [ ] Test responsive behavior on all devices

### Phase 3: Error Pages (Week 3)
- [ ] Create custom 404 page
- [ ] Add 404 SVG illustration
- [ ] Style error page
- [ ] Test error page display

### Phase 4: Optimization (Week 4)
- [ ] Implement lazy loading for images
- [ ] Add WebP support with fallbacks
- [ ] Optimize image sizes
- [ ] Add preload for critical images
- [ ] Test page load performance

---

## File Structure After Integration

```
xgc_theme/public/
├── css/
│   ├── xgc_variables.css
│   ├── xgc_components.css
│   ├── xgc_desk.css
│   ├── xgc_website.css
│   ├── xgc_dark.css
│   └── xgc_hero.css          # NEW
├── js/
│   └── xgc_theme.js           # UPDATED with slider
├── media/
│   ├── logo/                  # INTEGRATED
│   ├── favicons/              # INTEGRATED
│   ├── banners/               # INTEGRATED
│   ├── sliders/               # INTEGRATED
│   ├── team/                  # INTEGRATED
│   ├── partners/              # INTEGRATED
│   ├── photos/                # INTEGRATED
│   └── 404 Error.svg          # INTEGRATED
└── site.webmanifest           # NEW
```

---

## Testing Checklist

### Visual Testing
- [ ] Logo displays correctly in Desk sidebar
- [ ] Logo displays correctly in Website header
- [ ] Favicon appears in browser tab
- [ ] Hero slider transitions smoothly
- [ ] Partner logos display in grid
- [ ] Team photos display correctly
- [ ] Blog banners load properly
- [ ] 404 page displays SVG illustration

### Responsive Testing
- [ ] Logo scales appropriately on mobile
- [ ] Hero slider works on all devices
- [ ] Partner grid adapts to screen size
- [ ] Team grid adapts to screen size
- [ ] Blog cards stack on mobile

### Performance Testing
- [ ] Images load efficiently
- [ ] WebP images load where supported
- [ ] Lazy loading works correctly
- [ ] Page load time is acceptable
- [ ] No layout shift during image loading

### Theme Testing
- [ ] All images display correctly in light theme
- [ ] All images display correctly in dark theme
- [ ] Logo contrast is sufficient in both themes
- [ ] Partner logos are visible in both themes

---

## Next Steps

1. **Review this guide** and prioritize which integrations to implement first
2. **Create a branch** for media integration work
3. **Implement Phase 1** (Essential Branding) first
4. **Test thoroughly** before moving to next phase
5. **Update hooks.py** to include new CSS files
6. **Run `bench build`** after making changes
7. **Clear cache** with `bench clear-cache`
8. **Test in browser** to verify changes

---

## Additional Resources

### Image Optimization Tools
- **ImageOptim** (Mac): https://imageoptim.com/
- **Squoosh** (Web): https://squoosh.app/
- **Sharp** (Node.js): https://sharp.pixelplumbing.com/

### WebP Conversion
```bash
# Convert PNG to WebP
cwebp input.png -o output.webp -q 80

# Batch convert
for file in *.png; do cwebp "$file" -o "${file%.png}.webp" -q 80; done
```

### Lazy Loading
```html
<!-- Native lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- With Intersection Observer (for older browsers) -->
<img data-src="image.jpg" class="lazy" alt="Description">
```

---

## Support

For questions or issues with media integration:
1. Review this guide
2. Check the theme documentation
3. Test in a development environment first
4. Verify file paths are correct
5. Ensure assets are accessible via `/assets/xgc_theme/media/`

---

## Conclusion

This guide provides a comprehensive plan for integrating all media assets into the XGC Theme. Follow the phased approach to ensure smooth implementation and thorough testing at each stage.

The media assets will significantly enhance the visual appeal and branding consistency of the XGC Theme across both Desk and Website interfaces.
