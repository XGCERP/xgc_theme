import "./bootstrap";

import { createApp, h } from "vue";
import { createInertiaApp, Link, Head } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createPinia } from "pinia";

// Main layouts
import LayoutAuthenticated from "@/layouts/Authenticated.vue";
import LayoutGuestLanding from "@/layouts/GuestLanding.vue";
import LayoutGuestSimple from "@/layouts/GuestSimple.vue";

// Preview layout variations
import LayoutSimple from "@/layouts/variations/Simple.vue";
import LayoutLanding from "@/layouts/variations/Landing.vue";
import LayoutBackend from "@/layouts/variations/Backend.vue";
import LayoutBackendBoxed from "@/layouts/variations/BackendBoxed.vue";
import LayoutBackendMegaMenu from "@/layouts/variations/BackendMegaMenu.vue";
import LayoutBackendSidebarMiniNav from "@/layouts/variations/BackendSidebarMiniNav.vue";

// Main Stylesheet
import "@/../scss/main.scss";

// All color themes are included and available by default
// Feel free to comment out any of them if you won't use them in your project
import "@/../scss/oneui/themes/amethyst.scss";
import "@/../scss/oneui/themes/city.scss";
import "@/../scss/oneui/themes/flat.scss";
import "@/../scss/oneui/themes/modern.scss";
import "@/../scss/oneui/themes/smooth.scss";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

const appName = window.document.getElementsByTagName("title")[0]?.innerText;

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  progress: {
    color: "#3b82f6",
  },
  resolve: (name) => {
    const page = resolvePageComponent(
      `./views/${name}.vue`,
      import.meta.glob("./views/**/*.vue"),
    );

    // Set default persistent layout
    page.then((module) => {
      if (module.default.layout === undefined) {
        // Check if we are in a preview page
        if (name.startsWith("preview/")) {
          if (name === "preview/backend/elements/MegaMenuView") {
            module.default.layout = LayoutBackendMegaMenu;
          } else if (
            name === "preview/backend/pages/generic/SidebarMiniNavView"
          ) {
            module.default.layout = LayoutBackendSidebarMiniNav;
          } else if (
            name.startsWith("preview/auth/") ||
            name.startsWith("preview/errors/") ||
            name.startsWith("preview/specials/")
          ) {
            module.default.layout = LayoutSimple;
          } else if (name.startsWith("preview/landing/")) {
            module.default.layout = LayoutLanding;
          } else if (name.startsWith("preview/backend-boxed/")) {
            module.default.layout = LayoutBackendBoxed;
          } else {
            module.default.layout = LayoutBackend;
          }
        } else {
          // We are in working application pages
          if (name === "Welcome") {
            module.default.layout = LayoutGuestLanding;
          } else if (name.startsWith("auth/")) {
            module.default.layout = LayoutGuestSimple;
          } else {
            module.default.layout = LayoutAuthenticated;
          }
        }
      }
    });

    return page;
  },
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(createPinia())
      .component("Link", Link)
      .component("Head", Head)
      .component("BaseBlock", BaseBlock)
      .component("BaseBackground", BaseBackground)
      .component("BasePageHeading", BasePageHeading)
      .directive("click-ripple", clickRipple)
      .mount(el);
  },
});
