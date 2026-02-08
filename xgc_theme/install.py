"""
XGC Theme Installation Script

This module handles post-installation tasks for the XGC Theme app:
1. Imports fixtures (Website Theme records)
2. Sets XGC Light as the default website theme
3. Configures website settings
"""

import frappe
from frappe import _


def after_install():
    """
    Called after the app is installed on a site.
    
    This function:
    - Ensures fixtures are loaded
    - Sets XGC Light as the default theme
    - Configures website settings
    - Clears cache to apply changes
    """
    try:
        frappe.logger().info("XGC Theme: Starting post-installation setup...")
        
        # Set default website theme
        set_default_theme()
        
        # Configure website settings
        configure_website_settings()
        
        # Clear cache to apply changes
        frappe.clear_cache()
        frappe.clear_website_cache()
        
        frappe.logger().info("XGC Theme: Installation completed successfully!")
        
        # Show success message to user
        frappe.msgprint(
            _("XGC Theme has been installed successfully! The XGC Light theme is now active."),
            title=_("Installation Complete"),
            indicator="green"
        )
        
    except Exception as e:
        frappe.logger().error(f"XGC Theme: Installation error - {str(e)}")
        frappe.log_error(
            title="XGC Theme Installation Error",
            message=frappe.get_traceback()
        )


def set_default_theme():
    """
    Set XGC Light as the default website theme.
    """
    try:
        # Check if XGC Light theme exists
        if frappe.db.exists("Website Theme", "XGC Light"):
            # Update Website Settings
            website_settings = frappe.get_single("Website Settings")
            website_settings.website_theme = "XGC Light"
            website_settings.save(ignore_permissions=True)
            
            frappe.logger().info("XGC Theme: Set 'XGC Light' as default theme")
        else:
            frappe.logger().warning("XGC Theme: 'XGC Light' theme not found in fixtures")
            
    except Exception as e:
        frappe.logger().error(f"XGC Theme: Error setting default theme - {str(e)}")
        raise


def configure_website_settings():
    """
    Configure website settings with XGC branding.
    """
    try:
        website_settings = frappe.get_single("Website Settings")
        
        # Set favicon if not already set
        if not website_settings.favicon:
            website_settings.favicon = "/assets/xgc_theme/media/favicons/favicon.ico"
        
        # Set brand HTML if not already set
        if not website_settings.brand_html:
            website_settings.brand_html = '<img src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h400.webp" alt="XGC" style="height: 40px;">'
        
        # Set app name if not already set
        if not website_settings.app_name:
            website_settings.app_name = "XGC"
        
        website_settings.save(ignore_permissions=True)
        
        frappe.logger().info("XGC Theme: Configured website settings")
        
    except Exception as e:
        frappe.logger().error(f"XGC Theme: Error configuring website settings - {str(e)}")
        # Don't raise - this is optional configuration


def before_install():
    """
    Called before the app is installed on a site.
    
    Can be used for pre-installation checks or setup.
    """
    frappe.logger().info("XGC Theme: Starting installation...")
