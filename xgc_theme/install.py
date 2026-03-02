import frappe


def before_install():
    frappe.logger().info("XGC Theme: Starting installation...")


def after_install():
    try:
        _set_default_theme()
        _configure_website_settings()
        frappe.clear_cache()
        frappe.clear_website_cache()
        frappe.logger().info("XGC Theme: Installation complete.")
    except Exception:
        frappe.log_error(title="XGC Theme Installation Error", message=frappe.get_traceback())


def _set_default_theme():
    if not frappe.db.exists("Website Theme", "XGC Light"):
        frappe.logger().warning("XGC Theme: 'XGC Light' not found, skipping default theme set.")
        return
    ws = frappe.get_single("Website Settings")
    ws.website_theme = "XGC Light"
    ws.save(ignore_permissions=True)


def _configure_website_settings():
    ws = frappe.get_single("Website Settings")
    if not ws.favicon:
        ws.favicon = "/assets/xgc_theme/media/favicons/favicon.ico"
    if not ws.app_name:
        ws.app_name = "XGC"
    ws.save(ignore_permissions=True)
