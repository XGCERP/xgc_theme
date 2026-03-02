frappe.provide("xgc_theme");

xgc_theme = {
    init() {
        this.apply_branding();
        this.setup_theme_transition();
    },

    apply_branding() {
        // Replace "ERPNext" / "Frappe" text nodes with "XGC" in the navbar/header
        const brandSelectors = [".navbar-brand", ".app-name", ".site-name"];
        brandSelectors.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el) => {
                if (el.childNodes.length) {
                    el.childNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.textContent = node.textContent
                                .replace(/\bERPNext\b/g, "XGC")
                                .replace(/\bFrappe\b/g, "XGC");
                        }
                    });
                }
            });
        });
    },

    setup_theme_transition() {
        $(document).on("theme-change", () => {
            document.body.classList.add("xgc-theme-transitioning");
            setTimeout(
                () => document.body.classList.remove("xgc-theme-transitioning"),
                300
            );
        });
    },
};

// Frappe v16: desk is a Vue SPA — init after each route change
frappe.router.on("change", () => xgc_theme.init());

// Also run on first load after frappe is ready
$(document).on("page-change", () => xgc_theme.init());
