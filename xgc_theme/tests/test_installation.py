"""
Test XGC Theme Installation

Tests to verify that the theme installs correctly and all components are present.
"""

import frappe
import unittest


class TestXGCThemeInstallation(unittest.TestCase):
    """Test suite for XGC Theme installation"""
    
    def test_app_installed(self):
        """Test that xgc_theme app is installed"""
        installed_apps = frappe.get_installed_apps()
        self.assertIn("xgc_theme", installed_apps, "xgc_theme app should be installed")
    
    def test_xgc_light_theme_exists(self):
        """Test that XGC Light theme exists"""
        self.assertTrue(
            frappe.db.exists("Website Theme", "XGC Light"),
            "XGC Light theme should exist"
        )
    
    def test_xgc_dark_theme_exists(self):
        """Test that XGC Dark theme exists"""
        self.assertTrue(
            frappe.db.exists("Website Theme", "XGC Dark"),
            "XGC Dark theme should exist"
        )
    
    def test_default_theme_set(self):
        """Test that XGC Light is set as default theme"""
        website_settings = frappe.get_single("Website Settings")
        self.assertEqual(
            website_settings.website_theme,
            "XGC Light",
            "XGC Light should be the default theme"
        )
    
    def test_website_settings_configured(self):
        """Test that website settings are configured with XGC branding"""
        website_settings = frappe.get_single("Website Settings")
        
        # Check favicon
        self.assertIn(
            "xgc_theme",
            website_settings.favicon or "",
            "Favicon should be set to XGC theme favicon"
        )
        
        # Check app name
        self.assertEqual(
            website_settings.app_name,
            "XGC",
            "App name should be set to XGC"
        )
    
    def test_theme_has_custom_scss(self):
        """Test that XGC Light theme has custom SCSS defined"""
        theme = frappe.get_doc("Website Theme", "XGC Light")
        
        self.assertIsNotNone(theme.custom_scss, "Theme should have custom SCSS")
        self.assertIn("$xgc-primary", theme.custom_scss, "Custom SCSS should define $xgc-primary")
        self.assertIn("$xgc-secondary", theme.custom_scss, "Custom SCSS should define $xgc-secondary")
    
    def test_theme_colors_defined(self):
        """Test that theme colors are properly defined"""
        theme = frappe.get_doc("Website Theme", "XGC Light")
        
        # Check that custom SCSS has color definitions
        self.assertIn("#2E7D32", theme.custom_scss, "Should have forest green color")
        self.assertIn("#1B5E20", theme.custom_scss, "Should have dark green color")
    
    def test_dark_theme_colors_defined(self):
        """Test that dark theme has appropriate colors"""
        theme = frappe.get_doc("Website Theme", "XGC Dark")
        
        # Check that custom SCSS has dark theme colors
        self.assertIn("#66BB6A", theme.custom_scss, "Should have light green for dark theme")
        self.assertIn("#121212", theme.custom_scss, "Should have dark background color")


class TestXGCThemeAssets(unittest.TestCase):
    """Test suite for XGC Theme assets"""
    
    def test_css_files_exist(self):
        """Test that CSS files are defined in hooks"""
        from xgc_theme.hooks import app_include_css, web_include_css
        
        # Check desk CSS
        self.assertIn("/assets/xgc_theme/css/xgc_variables.css", app_include_css)
        self.assertIn("/assets/xgc_theme/css/xgc_components.css", app_include_css)
        self.assertIn("/assets/xgc_theme/css/xgc_desk.css", app_include_css)
        
        # Check website CSS
        self.assertIn("/assets/xgc_theme/css/xgc_variables.css", web_include_css)
        self.assertIn("/assets/xgc_theme/css/xgc_components.css", web_include_css)
        self.assertIn("/assets/xgc_theme/css/xgc_website.css", web_include_css)
    
    def test_js_files_exist(self):
        """Test that JavaScript files are defined in hooks"""
        from xgc_theme.hooks import app_include_js, web_include_js
        
        # Check desk JS
        self.assertIn("/assets/xgc_theme/js/xgc_theme.js", app_include_js)
        
        # Check website JS
        self.assertIn("/assets/xgc_theme/js/xgc_theme.js", web_include_js)
    
    def test_fixtures_configured(self):
        """Test that fixtures are properly configured"""
        from xgc_theme.hooks import fixtures
        
        self.assertIsNotNone(fixtures, "Fixtures should be defined")
        self.assertGreater(len(fixtures), 0, "Should have at least one fixture")
        
        # Check for Website Theme fixture
        theme_fixture = None
        for fixture in fixtures:
            if isinstance(fixture, dict) and fixture.get("dt") == "Website Theme":
                theme_fixture = fixture
                break
        
        self.assertIsNotNone(theme_fixture, "Should have Website Theme fixture")


class TestXGCThemeHooks(unittest.TestCase):
    """Test suite for XGC Theme hooks"""
    
    def test_after_install_hook_defined(self):
        """Test that after_install hook is defined"""
        from xgc_theme.hooks import after_install
        
        self.assertIsNotNone(after_install, "after_install hook should be defined")
        self.assertEqual(
            after_install,
            "xgc_theme.install.after_install",
            "after_install should point to correct function"
        )
    
    def test_before_install_hook_defined(self):
        """Test that before_install hook is defined"""
        from xgc_theme.hooks import before_install
        
        self.assertIsNotNone(before_install, "before_install hook should be defined")
        self.assertEqual(
            before_install,
            "xgc_theme.install.before_install",
            "before_install should point to correct function"
        )


def run_tests():
    """Run all installation tests"""
    import sys
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestXGCThemeInstallation))
    suite.addTests(loader.loadTestsFromTestCase(TestXGCThemeAssets))
    suite.addTests(loader.loadTestsFromTestCase(TestXGCThemeHooks))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    import sys
    sys.exit(run_tests())
