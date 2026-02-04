#!/usr/bin/env python3
import frappe

frappe.connect(site="dev.localhost")

# XGC Light Theme
if not frappe.db.exists("Website Theme", "XGC Light"):
    theme = frappe.get_doc({
        "doctype": "Website Theme",
        "theme": "XGC Light",
        "module": "Website",
        "custom": 1,
        "js": "/assets/xgc_theme/js/xgc_theme.js",
        "custom_scss": "@import 'xgc_variables';\n@import 'xgc_components';\n@import 'xgc_website';",
        "apply_style": 1,
        "apply_text_styles": 1,
        "font_size": "16px",
        "background_color": "#ffffff",
        "text_color": "#1e293b"
    })
    theme.insert()
    print("Created: XGC Light")
else:
    print("XGC Light already exists")

# XGC Dark Theme
if not frappe.db.exists("Website Theme", "XGC Dark"):
    theme = frappe.get_doc({
        "doctype": "Website Theme",
        "theme": "XGC Dark",
        "module": "Website",
        "custom": 1,
        "js": "/assets/xgc_theme/js/xgc_theme.js",
        "custom_scss": "@import 'xgc_variables';\n@import 'xgc_components';\n@import 'xgc_website';\n@import 'xgc_dark';",
        "apply_style": 1,
        "apply_text_styles": 1,
        "font_size": "16px",
        "background_color": "#0f172a",
        "text_color": "#e2e8f0"
    })
    theme.insert()
    print("Created: XGC Dark")
else:
    print("XGC Dark already exists")

frappe.db.commit()
print("Done!")
