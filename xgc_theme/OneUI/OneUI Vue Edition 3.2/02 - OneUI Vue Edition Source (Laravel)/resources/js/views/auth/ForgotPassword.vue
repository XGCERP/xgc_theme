<script setup>
import { useForm } from "@inertiajs/vue3";
import { useTemplateStore } from "@/stores/template";

defineProps({
  status: {
    type: String,
  },
});

const store = useTemplateStore();

const form = useForm({
  email: "",
});

const submit = () => {
  form.post("/forgot-password");
};
</script>

<template>
  <Head title="Forgot Password" />

  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/photo14@2x.jpg">
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <Link href="/" class="link-fx fw-semibold fs-2 text-white">
              OneUI <span class="fw-normal">Vue</span>
            </Link>
            <p class="text-white-75 me-xl-8 mt-2">
              Forgot your password? No worries at all. We've got your back!
            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <Link href="/" class="link-fx fw-semibold fs-3 text-dark">
            OneUI <span class="fw-normal">Vue</span>
          </Link>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <h1 class="fw-black mb-2">Forgot Password</h1>
              <p class="fw-medium text-muted">
                No problem! Just let us know your email and we will email you a
                password reset link.
              </p>
            </div>
            <!-- END Header -->

            <!-- Forgot Password Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <div
                  v-if="status"
                  class="alert alert-success d-flex align-items-center justify-content-center fs-sm fw-medium mb-5"
                  role="alert"
                >
                  <i
                    class="fa fa-check-circle me-2 opacity-50 flex-shrink-0"
                  ></i>
                  <span>{{ status }}</span>
                </div>

                <form @submit.prevent="submit">
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
                      autofocus
                      autocomplete="username"
                    />
                    <div v-show="form.errors.email" class="invalid-feedback">
                      {{ form.errors.email }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <button
                      type="submit"
                      class="btn w-100 btn-alt-primary"
                      :class="{ 'opacity-25': form.processing }"
                      :disabled="form.processing"
                    >
                      Email password reset link
                      <i class="fa fa-fw fa-arrow-right ms-1 opacity-50"></i>
                    </button>
                  </div>
                  <div class="border-top py-3 text-center">
                    <Link
                      href="/login"
                      class="text-muted fs-sm fw-medium d-block d-lg-inline-block mb-1"
                    >
                      Did you remember your password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Forgot Password Form -->
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Main Section -->
    </div>
  </BaseBackground>
  <!-- END Page Content -->
</template>
