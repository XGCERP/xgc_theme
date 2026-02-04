#!/usr/bin/env python3
"""Script to create XGC Website Themes in Frappe"""

import frappe

def create_xgc_themes():
    """Create XGC Light and XGC Dark website themes"""
    
    themes = [
        {
            "name": "XGC Light",
            "theme": "XGC Light",
            "custom": 1,
            "js": "/assets/xgc_theme/js/xgc_theme.js",
            "apply_style": 1,
            "apply_text_styles": 1,
            "font_size": "16px",
            "heading_font": "Inter",
            "text_font": "Inter",
            "background_color": "#ffffff",
            "text_color": "#1e293b"
        },
        {
            "name": "XGC Dark",
            "theme": "XGC Dark",
            "custom": 1,
            "js": "/assets/xgc_theme/js/xgc_theme.js",
            "apply_style": 1,
            "apply_text_styles": 1,
            "font_size": "16px",
            "heading_font": "Inter",
            "text_font": "Inter",
            "background_color": "#0f172a",
            "text_color": "#e2e8f0"
        }
    ]
    
    for theme_data in themes:
        theme_name = theme_data["name"]
        
        # Check if theme already exists
        if frappe.db.exists("Website Theme", theme_name):
            print(f"Theme '{theme_name}' already exists, updating...")
            theme = frappe.get_doc("Website Theme", theme_name)
            theme.update(theme_data)
        else:
            print(f"Creating theme '{theme_name}'...")
            theme = frappe.get_doc({
                "doctype": "Website Theme",
                **theme_data
            })
        
        theme.save()
        print(f"✓ Theme '{theme_name}' saved successfully")
    
    frappe.db.commit()
    print("\n✓ All themes created/updated successfully!")
    print("\nYou can now select 'XGC Light' or 'XGC Dark' in:")
    print("Website Settings > Website Theme")

if __name__ == "__main__":
    create_xgc_themes()
