<script setup>
import { useTemplateStore } from "@/stores/template";

import BaseLayout from "@/layouts/BaseLayout.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";

// Main store
const store = useTemplateStore();

// Set default elements for this layout
store.setLayout({
  header: true,
  sidebar: true,
  sideOverlay: true,
  footer: true,
});

// Set various template options for this layout variation
store.header({ mode: "fixed" });
store.headerStyle({ mode: "light" });
store.mainContent({ mode: "narrow" });
</script>

<template>
  <BaseLayout>
    <!-- Side Overlay Header -->
    <!-- Using the available v-slot, we can override the default Side Overlay header from layouts/partials/SideOvelay.vue -->
    <template #side-overlay-header>
      <!-- User Avatar -->
      <a class="img-link me-1" href="javascript:void(0)">
        <img
          class="img-avatar img-avatar32"
          :src="$page.props.auth.user.gravatar"
          alt="User Avatar"
        />
      </a>
      <!-- END User Avatar -->

      <!-- User Info -->
      <div class="ms-2">
        <Link href="/profile" class="text-dark fw-semibold fs-sm">{{
          $page.props.auth.user.name
        }}</Link>
      </div>
      <!-- END User Info -->
    </template>
    <!-- END Side Overlay Header -->

    <!-- Side Overlay Content -->
    <!-- Using the available v-slot, we can override the default Side Overlay content from layouts/partials/SideOvelay.vue -->
    <template #side-overlay-content>
      <div class="content-side">
        <p class="fs-sm">Side Overlay content..</p>
      </div>
    </template>
    <!-- END Side Overlay Content -->

    <!-- Sidebar Content -->
    <!-- Using the available v-slot, we can override the default Sidebar content from layouts/partials/Sidebar.vue -->
    <template #sidebar-content>
      <div class="content-side">
        <BaseNavigation
          :nodes="[
            {
              name: 'Dashboard',
              to: '/dashboard',
              icon: 'fa fa-rocket',
            },
            {
              name: 'Account',
              heading: true,
            },
            {
              name: 'Profile',
              to: '/profile',
              icon: 'fa fa-user-circle',
            },
            {
              name: 'More',
              heading: true,
            },
            {
              name: 'Landing',
              to: '/',
              icon: 'fa fa-arrow-left',
            },
          ]"
        />
      </div>
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content Left -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-left>
      <!-- Toggle Sidebar -->
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary me-2"
        @click="store.sidebar({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-bars"></i>
      </button>
      <!-- END Toggle Sidebar -->
    </template>
    <!-- END Header Content Left -->

    <!-- Header Content Right -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-right>
      <!-- User Dropdown -->
      <div class="dropdown d-inline-block ms-2">
        <button
          type="button"
          class="btn btn-sm btn-alt-secondary d-flex align-items-center"
          id="page-header-user-dropdown"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            class="rounded-circle"
            :src="$page.props.auth.user.gravatar"
            alt="User Avatar"
            style="width: 21px"
          />
          <span class="d-none d-sm-inline-block ms-2">{{
            $page.props.auth.user.name.split(" ")[0]
          }}</span>
          <i
            class="fa fa-fw fa-angle-down d-none d-sm-inline-block opacity-50 ms-1 mt-1"
          ></i>
        </button>
        <div
          class="dropdown-menu dropdown-menu-md dropdown-menu-end p-0 border-0"
          aria-labelledby="page-header-user-dropdown"
        >
          <div class="p-2">
            <Link
              href="/profile"
              class="dropdown-item d-flex align-items-center justify-content-between"
            >
              <span class="fs-sm fw-medium">Profile</span>
            </Link>
            <Link
              href="/logout"
              method="post"
              class="dropdown-item d-flex align-items-center justify-content-between"
              as="button"
            >
              <span class="fs-sm fw-medium">Log Out</span>
            </Link>
          </div>
        </div>
      </div>
      <!-- END User Dropdown -->

      <!-- Toggle Side Overlay -->
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary ms-2"
        @click="store.sideOverlay({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-list-ul fa-flip-horizontal"></i>
      </button>
      <!-- END Toggle Side Overlay -->
    </template>
    <!-- END Header Content Right -->

    <!-- Footer Content Left -->
    <!-- Using the available v-slot, we can override the default Footer content from layouts/partials/Footer.vue -->
    <template #footer-content-left>
      <strong>{{ store.app.version }}</strong>
      &copy; {{ store.app.copyright }}
    </template>
    <!-- END Footer Content Left -->

    <slot />
  </BaseLayout>
</template>
