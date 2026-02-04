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
        $(document).on('theme-change', function(e, theme) {
            console.log('XGC Theme: Theme changing to', theme);
            $('body').addClass('theme-transitioning');
            setTimeout(function() { $('body').removeClass('theme-transitioning'); console.log('XGC Theme: Theme transition complete'); }, 300);
        });
    },
    
    /**
     * Apply component enhancements
     * Adds OneUI-style ripple effects to buttons
     */
    apply_component_enhancements: function() {
        console.log('XGC Theme: Applying component enhancements');
        $(document).on('click', '.btn', function(e) {
            var ripple = $('<span class="ripple"></span>');
            $(this).append(ripple);
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            ripple.css({ left: x + 'px', top: y + 'px' });
            setTimeout(function() { ripple.remove(); }, 600);
        });
    },
    
    /**
     * Set up responsive handlers
     * Adds debounced resize handler to toggle body classes based on viewport width
     */
    setup_responsive_handlers: function() {
        console.log('XGC Theme: Setting up responsive handlers');
        var handleResize = frappe.utils.debounce(function() {
            var width = $(window).width();
            $('body').toggleClass('mobile-view', width < 768);
            $('body').toggleClass('tablet-view', width >= 768 && width < 1024);
            $('body').toggleClass('desktop-view', width >= 1024);
            console.log('XGC Theme: Viewport width', width, 'px');
        }, 250);
        $(window).on('resize', handleResize);
        handleResize();
    }
};

/**
 * Initialize theme on document ready
 */
$(document).ready(function() {
    xgc_theme.init();
});


/**
 * Website Navbar Enhancements
 * Provides mobile menu functionality and smooth interactions
 */
xgc_theme.navbar = {
    /**
     * Initialize navbar enhancements
     */
    init: function() {
        console.log('XGC Theme: Initializing navbar enhancements');
        
        this.setup_mobile_menu();
        this.setup_dropdown_behavior();
        this.setup_scroll_behavior();
        this.setup_search_enhancements();
    },
    
    /**
     * Set up mobile menu (hamburger) functionality
     */
    setup_mobile_menu: function() {
        var navbar = $('.navbar');
        var toggler = $('.navbar-toggler');
        var collapse = $('.navbar-collapse');
        
        // Ensure Bootstrap collapse is working
        toggler.on('click', function(e) {
            e.preventDefault();
            var target = $(this).data('target');
            var $target = $(target);
            
            // Toggle collapsed state
            if ($target.hasClass('show')) {
                $target.removeClass('show');
                $(this).attr('aria-expanded', 'false');
                $(this).removeClass('active');
            } else {
                $target.addClass('show');
                $(this).attr('aria-expanded', 'true');
                $(this).addClass('active');
            }
        });
        
        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if ($(window).width() < 992) {
                if (!$(e.target).closest('.navbar').length) {
                    collapse.removeClass('show');
                    toggler.attr('aria-expanded', 'false');
                    toggler.removeClass('active');
                }
            }
        });
        
        // Close mobile menu when clicking a nav link
        $('.navbar-nav .nav-link').on('click', function() {
            if ($(window).width() < 992) {
                collapse.removeClass('show');
                toggler.attr('aria-expanded', 'false');
                toggler.removeClass('active');
            }
        });
        
        console.log('XGC Theme: Mobile menu initialized');
    },
    
    /**
     * Set up dropdown behavior for desktop and mobile
     */
    setup_dropdown_behavior: function() {
        var dropdowns = $('.navbar-nav .dropdown');
        
        // Desktop: hover to open
        if ($(window).width() >= 992) {
            dropdowns.on('mouseenter', function() {
                $(this).find('.dropdown-menu').addClass('show');
            });
            
            dropdowns.on('mouseleave', function() {
                $(this).find('.dropdown-menu').removeClass('show');
            });
        }
        
        // Mobile: click to toggle
        $('.navbar-nav .dropdown-toggle').on('click', function(e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                var menu = $(this).next('.dropdown-menu');
                
                // Close other dropdowns
                $('.navbar-nav .dropdown-menu').not(menu).removeClass('show');
                
                // Toggle this dropdown
                menu.toggleClass('show');
            }
        });
        
        console.log('XGC Theme: Dropdown behavior initialized');
    },
    
    /**
     * Set up scroll behavior (sticky navbar, shadow on scroll)
     */
    setup_scroll_behavior: function() {
        var navbar = $('.navbar');
        var lastScroll = 0;
        
        $(window).on('scroll', frappe.utils.debounce(function() {
            var currentScroll = $(window).scrollTop();
            
            // Add shadow when scrolled
            if (currentScroll > 10) {
                navbar.addClass('scrolled');
            } else {
                navbar.removeClass('scrolled');
            }
            
            lastScroll = currentScroll;
        }, 100));
        
        console.log('XGC Theme: Scroll behavior initialized');
    },
    
    /**
     * Set up search enhancements
     */
    setup_search_enhancements: function() {
        var searchInput = $('.navbar-modal-search');
        
        // Focus search on keyboard shortcut (Ctrl+K or Cmd+K)
        $(document).on('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
        
        // Clear search on Escape
        searchInput.on('keydown', function(e) {
            if (e.key === 'Escape') {
                $(this).val('').blur();
            }
        });
        
        console.log('XGC Theme: Search enhancements initialized');
    }
};

/**
 * Initialize navbar enhancements on document ready (for website pages)
 */
$(document).ready(function() {
    // Only initialize on website pages (not desk)
    if (!window.cur_page && $('.navbar').length) {
        xgc_theme.navbar.init();
    }
});
