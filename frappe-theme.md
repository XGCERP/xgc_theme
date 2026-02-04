Creating a custom theme app for Frappe/ERPNext is the recommended way to modify the UI (the "Desk") and the website portal without touching core files. This ensures your customizations are upgrade-safe.

Below is the step-by-step process and the key technical details you'll need.

---

## 1. Create and Install the App

First, you need a container for your theme. From your `frappe-bench` directory, run:

```bash
# Create the app (follow the prompts for author, description, etc.)
bench new-app my_theme_app

# Install it on your specific site
bench --site [your-site-name] install-app my_theme_app

```

## 2. Structure Your Theme Files

Navigate to your app directory. You will primarily work within the `public` folder.

**Recommended Structure:**

```text
my_theme_app/
└── my_theme_app/
    ├── hooks.py
    └── public/
        ├── css/
        │   └── my_theme.css
        └── js/
            └── my_theme.js (optional)

```

## 3. Register Styles in `hooks.py`

To tell Frappe to load your CSS and JS globally across the Desk (admin area) or the Website (frontend), you must add them to `hooks.py`.

```python
# my_theme_app/hooks.py

# To include in the admin/desk interface:
app_include_css = "/assets/my_theme_app/css/my_theme.css"
app_include_js = "/assets/my_theme_app/js/my_theme.js"

# To include on the public-facing website:
web_include_css = "/assets/my_theme_app/css/my_theme.css"

```

---

## 4. Crafting the CSS

Frappe uses CSS variables extensively. The most efficient way to theme is to override these variables in your `my_theme.css`.

### Example: Customizing Colors

```css
:root {
    --primary-color: #5e72e4;
    --text-color: #2d3436;
    --bg-color: #f4f5f7;
    --navbar-bg: #ffffff;
}

/* Targeting the sidebar specifically */
.desk-sidebar {
    background-color: var(--primary-color) !important;
    color: white !important;
}

```

> **Tip:** Use the browser's "Inspect Element" tool to find the specific CSS variables or classes Frappe uses for the navbar, sidebar, and buttons.

---

## 5. Overriding the Theme Switcher (Advanced)

If you want your theme to appear in the official "Toggle Theme" modal (where users choose Light/Dark), you need to extend the JavaScript `ThemeSwitcher` class in your `my_theme.js`.

```javascript
frappe.ui.ThemeSwitcher = class CustomThemeSwitcher extends frappe.ui.ThemeSwitcher {
    fetch_themes() {
        return new Promise((resolve) => {
            this.themes = [
                { name: "light", label: "Frappe Light" },
                { name: "dark", label: "Timeless Night" },
                { name: "my_custom_theme", label: "Company Brand", info: "Official Brand Theme" }
            ];
            resolve(this.themes);
        });
    }
}

```

---

## 6. Apply and Build

After making changes, you must rebuild the assets and clear the cache for them to take effect.

```bash
# Build the assets
bench build --app my_theme_app

# Clear site cache
bench --site [your-site-name] clear-cache

# If in production, restart services
bench restart

```

## Reliable Sources for Reference

* **[Frappe Framework Hooks Documentation](https://docs.frappe.io/framework/user/en/python-api/hooks):** Essential for understanding how to inject assets.
* **[Auriga IT Blog: Custom Themes](https://aurigait.com/blog/how-to-create-a-custom-theme-in-frappe-erpnext/):** A deep-dive tutorial on real-world implementation.
* **[GitHub: ni_dark_theme](https://www.google.com/search?q=https://github.com/RandyLowery/ni_dark_theme):** A classic community example of a full Frappe theme app.
