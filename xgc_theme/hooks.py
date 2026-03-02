app_name = "xgc_theme"
app_title = "XGC Theme"
app_publisher = "XGC"
app_description = "OneUI-based theme for Frappe/ERPNext"
app_email = "support@xgccorp.com"
app_license = "mit"
app_version = "0.0.1"

# Inject into desk only — not web portals (avoids conflicts with CRM, Raven, Insights)
app_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_desk.css",
]

app_include_js = [
    "/assets/xgc_theme/js/xgc_theme.js",
]

# Fixtures — Website Theme records for XGC Light and XGC Dark
fixtures = [
    {
        "dt": "Website Theme",
        "filters": [["name", "in", ["XGC Light", "XGC Dark"]]],
    }
]

before_install = "xgc_theme.install.before_install"
after_install = "xgc_theme.install.after_install"
