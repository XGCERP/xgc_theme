/**
 * XGC Theme - OneUI-based theme for Frappe/ERPNext
 * 
 * This module provides theme initialization and enhancements for the XGC theme,
 * integrating OneUI design patterns with Frappe's framework.
 */

// Provide xgc_theme namespace
frappe.provide('xgc_theme');

/**
 * Main theme object with initialization and enhancement functions
 */
xgc_theme = {
    /**
     * Initialize the theme
     * Called on document ready to set up all theme enhancements
     */
    init: function() {
        console.log('XGC Theme: Initializing...');
        
        try {
            this.setup_theme_switcher();
            this.apply_component_enhancements();
            this.setup_responsive_handlers();
            
            console.log('XGC Theme: Initialization complete');
        } catch (error) {
            console.error('XGC Theme: Initialization error', error);
        }
    },
    
    /**
     * Set up theme switcher enhancements
     * Adds smooth transitions when theme changes
     */
    setup_theme_switcher: function() {
        console.log('XGC Theme: Setting up theme switcher enhancements');
        
        // Listen for theme-change event from Frappe
        $(document).on('theme-change', function(e, theme) {
            console.log('XGC Theme: Theme changing to', theme);
            
            // Add transitioning class to body for smooth animation
            $('body').addClass('theme-transitioning');
            
            // Remove transitioning class after animation completes
            setTimeout(function() {
                $('body').removeClass('theme-transitioning');
                console.log('XGC Theme: Theme transition complete');
            }, 300);
        });
    },
    
    /**
     * Apply component enhancements
     * Adds OneUI-style ripple effects to buttons
     */
    apply_component_enhancements: function() {
        console.log('XGC Theme: Applying component enhancements');
        
        // Add ripple effect to buttons on click
        $(document).on('click', '.btn', function(e) {
            // Create ripple element
            const ripple = $('<span class="ripple"></span>');
            $(this).append(ripple);
            
            // Calculate ripple position relative to button
            const x = e.pageX - $(this).offset().left;
            const y = e.pageY - $(this).offset().top;
            
            // Position ripple at click location
            ripple.css({
                left: x + 'px',
                top: y + 'px'
            });
            
            // Remove ripple after animation completes
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    },
    
    /**
     * Set up responsive handlers
     * Adds debounced resize handler to toggle body classes based on viewport width
     */
    setup_responsive_handlers: function() {
        console.log('XGC Theme: Setting up responsive handlers');
        
        // Handle responsive behavior for OneUI components
        const handleResize = frappe.utils.debounce(function() {
            const width = $(window).width();
            
            // Toggle body classes based on viewport width
            // Mobile: < 768px
            // Tablet: 768px - 1023px
            // Desktop: >= 1024px
            $('body').toggleClass('mobile-view', width < 768);
            $('body').toggleClass('tablet-view', width >= 768 && width < 1024);
            $('body').toggleClass('desktop-view', width >= 1024);
            
            console.log('XGC Theme: Viewport width', width, 'px');
        }, 250);
        
        // Attach resize handler
        $(window).on('resize', handleResize);
        
        // Run immediately to set initial state
        handleResize();
    }
};

/**
 * Initialize theme on document ready
 */
$(document).ready(function() {
    xgc_theme.init();
});
