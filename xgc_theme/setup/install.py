"""
XGC Theme Setup Utilities

Additional setup functions for XGC Theme installation and configuration.
"""

import frappe
from frappe import _


def create_color_records():
    """
    Create Color DocType records for XGC theme colors.
    
    This ensures all required colors exist before Website Theme is created.
    """
    colors = [
        # XGC Light Theme Colors
        {"color_name": "XGC Forest Green", "color": "#2d5016"},
        {"color_name": "XGC Gold", "color": "#9c7a10"},
        {"color_name": "XGC White", "color": "#FFFFFF"},
        {"color_name": "XGC Off White", "color": "#F9FAFB"},
        {"color_name": "XGC Text Primary", "color": "#1F2937"},
        {"color_name": "XGC Text Muted", "color": "#6B7280"},
        {"color_name": "XGC Border", "color": "#E5E7EB"},
        
        # XGC Dark Theme Colors
        {"color_name": "XGC Dark Background", "color": "#0F172A"},
        {"color_name": "XGC Dark Surface", "color": "#1E293B"},
        {"color_name": "XGC Dark Text", "color": "#E2E8F0"},
        {"color_name": "XGC Dark Border", "color": "#334155"},
    ]
    
    for color_data in colors:
        try:
            if not frappe.db.exists("Color", color_data["color_name"]):
                color_doc = frappe.get_doc({
                    "doctype": "Color",
                    "color": color_data["color_name"],
                    "color_code": color_data["color"]
                })
                color_doc.insert(ignore_permissions=True)
                frappe.logger().info(f"Created color: {color_data['color_name']}")
        except Exception as e:
            frappe.logger().error(f"Error creating color {color_data['color_name']}: {str(e)}")


def verify_theme_installation():
    """
    Verify that XGC themes are properly installed.
    
    Returns:
        dict: Status of theme installation
    """
    status = {
        "xgc_light_exists": frappe.db.exists("Website Theme", "XGC Light"),
        "xgc_dark_exists": frappe.db.exists("Website Theme", "XGC Dark"),
        "is_default": False
    }
    
    if status["xgc_light_exists"]:
        website_settings = frappe.get_single("Website Settings")
        status["is_default"] = website_settings.website_theme == "XGC Light"
    
    return status


def reset_theme_to_default():
    """
    Reset the website theme to XGC Light.
    
    Useful for troubleshooting or after theme updates.
    """
    try:
        if frappe.db.exists("Website Theme", "XGC Light"):
            website_settings = frappe.get_single("Website Settings")
            website_settings.website_theme = "XGC Light"
            website_settings.save(ignore_permissions=True)
            
            frappe.clear_cache()
            frappe.clear_website_cache()
            
            frappe.msgprint(
                _("Website theme has been reset to XGC Light"),
                title=_("Theme Reset"),
                indicator="green"
            )
            return True
        else:
            frappe.msgprint(
                _("XGC Light theme not found. Please reinstall the app."),
                title=_("Theme Not Found"),
                indicator="red"
            )
            return False
    except Exception as e:
        frappe.log_error(
            title="XGC Theme Reset Error",
            message=frappe.get_traceback()
        )
        return False
