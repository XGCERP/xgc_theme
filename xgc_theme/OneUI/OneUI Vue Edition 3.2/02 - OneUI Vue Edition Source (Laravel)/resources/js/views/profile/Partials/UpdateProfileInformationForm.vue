<script setup>
import { useForm, usePage } from "@inertiajs/vue3";

defineProps({
  mustVerifyEmail: {
    type: Boolean,
  },
  status: {
    type: String,
  },
});

const user = usePage().props.auth.user;

const form = useForm({
  name: user.name,
  email: user.email,
});
</script>

<template>
  <form @submit.prevent="form.patch('/profile', { preserveScroll: true })">
    <div
      v-if="
        mustVerifyEmail &&
        user.email_verified_at === null &&
        status === 'verification-link-sent'
      "
      class="alert alert-success d-flex align-items-center justify-content-center fs-sm fw-medium mb-4"
      role="alert"
    >
      <i class="fa fa-check-circle me-2 opacity-50 flex-shrink-0"></i>
      <span>
        A new verification link has been sent to your email address.
      </span>
    </div>
    <!-- <div class="mb-4">
      <label class="form-label">Avatar (from Gravatar)</label>
      <div>
        <img
          class="img-avatar img-avatar-thumb"
          :src="$page.props.auth.user.gravatar"
          alt="User Avatar"
        />
      </div>
    </div> -->
    <div class="mb-4">
      <label class="form-label" for="name">Name</label>
      <input
        id="name"
        type="text"
        class="form-control form-control-lg form-control-alt"
        :class="{
          'is-invalid': form.errors.name,
        }"
        v-model="form.name"
        required
        autocomplete="name"
      />
      <div v-show="form.errors.email" class="invalid-feedback">
        {{ form.errors.name }}
      </div>
    </div>
    <div class="mb-4">
      <label class="form-label" for="email">Email</label>
      <input
        id="email"
        type="email"
        class="form-control form-control-lg form-control-alt"
        :class="{
          'is-invalid': form.errors.email,
        }"
        v-model="form.email"
        required
        autocomplete="username"
      />
      <div v-show="form.errors.email" class="invalid-feedback">
        {{ form.errors.email }}
      </div>
      <div
        v-if="mustVerifyEmail && user.email_verified_at === null"
        class="fs-sm text-muted mt-2"
      >
        Your email address is unverified!
      </div>
    </div>
    <div class="d-flex align-items-center gap-2">
      <Link
        v-if="mustVerifyEmail && user.email_verified_at === null"
        href="/email/verification-notification"
        method="post"
        as="button"
        class="btn btn-alt-primary"
      >
        Re-send the verification email
      </Link>
      <button type="submit" class="btn btn-primary" :disabled="form.processing">
        Save
      </button>
      <div v-if="form.recentlySuccessful" class="fs-sm text-muted">Saved!</div>
    </div>
  </form>
</template>
