"""
XGC Theme Setup Utilities

Additional setup functions for XGC Theme installation and configuration.
"""

import frappe
from frappe import _


def create_color_records():
    """
    Create Color DocType records for XGC theme colors.

    In Frappe v16, the Color doctype has a single 'color' field (hex value).
    The document name defaults to the hex value unless set explicitly.
    """
    colors = [
        # XGC Light Theme Colors
        {"name": "XGC Forest Green", "color": "#2E7D32"},
        {"name": "XGC Gold",         "color": "#9C7A10"},
        {"name": "XGC White",        "color": "#FFFFFF"},
        {"name": "XGC Off White",    "color": "#F9FAFB"},
        {"name": "XGC Text Primary", "color": "#1F2937"},
        {"name": "XGC Text Muted",   "color": "#6B7280"},
        {"name": "XGC Border",       "color": "#E5E7EB"},
        # XGC Dark Theme Colors
        {"name": "XGC Dark Background", "color": "#0F172A"},
        {"name": "XGC Dark Surface",    "color": "#1E293B"},
        {"name": "XGC Dark Text",       "color": "#E2E8F0"},
        {"name": "XGC Dark Border",     "color": "#334155"},
    ]

    for color_data in colors:
        try:
            if not frappe.db.exists("Color", color_data["name"]):
                color_doc = frappe.get_doc({
                    "doctype": "Color",
                    "name": color_data["name"],
                    "color": color_data["color"],
                })
                color_doc.insert(ignore_permissions=True)
                frappe.logger().info(f"XGC Theme: Created color: {color_data['name']}")
        except Exception as e:
            frappe.logger().error(f"XGC Theme: Error creating color {color_data['name']}: {str(e)}")


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
