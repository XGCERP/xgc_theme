<script setup>
import { ref } from "vue";
import { useForm } from "@inertiajs/vue3";

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

const form = useForm({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const updatePassword = () => {
  form.put("/password", {
    preserveScroll: true,
    onSuccess: () => form.reset(),
    onError: () => {
      if (form.errors.password) {
        form.reset("password", "password_confirmation");
        passwordInput.value.focus();
      }
      if (form.errors.current_password) {
        form.reset("current_password");
        currentPasswordInput.value.focus();
      }
    },
  });
};
</script>

<template>
  <form @submit.prevent="updatePassword">
    <div class="mb-4">
      <label class="form-label" for="current_password">Current Password</label>
      <input
        type="password"
        id="current_password"
        ref="currentPasswordInput"
        class="form-control form-control-lg form-control-alt"
        :class="{
          'is-invalid': form.errors.current_password,
        }"
        v-model="form.current_password"
        required
        autocomplete="current-password"
      />
      <div v-show="form.errors.current_password" class="invalid-feedback">
        {{ form.errors.current_password }}
      </div>
    </div>
    <div class="mb-4">
      <label class="form-label" for="password">Password</label>
      <input
        type="password"
        id="password"
        ref="passwordInput"
        class="form-control form-control-lg form-control-alt"
        :class="{
          'is-invalid': form.errors.password,
        }"
        v-model="form.password"
        required
        autocomplete="new-password"
      />
      <div v-show="form.errors.password" class="invalid-feedback">
        {{ form.errors.password }}
      </div>
    </div>
    <div class="mb-4">
      <label class="form-label" for="password_confirmation"
        >Confirm Password</label
      >
      <input
        type="password"
        id="password_confirmation"
        class="form-control form-control-lg form-control-alt"
        :class="{
          'is-invalid': form.errors.password_confirmation,
        }"
        v-model="form.password_confirmation"
        required
        autocomplete="new-password"
      />
      <div v-show="form.errors.password_confirmation" class="invalid-feedback">
        {{ form.errors.password_confirmation }}
      </div>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button type="submit" class="btn btn-primary" :disabled="form.processing">
        Save
      </button>
      <div v-if="form.recentlySuccessful" class="fs-sm text-muted">Saved!</div>
    </div>
  </form>
</template>
