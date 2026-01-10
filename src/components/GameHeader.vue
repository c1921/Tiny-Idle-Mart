<script setup lang="ts">
const props = defineProps<{ pausedByPlayer: boolean }>();
const emit = defineEmits<{ (e: "toggle-pause"): void }>();
</script>

<template>
  <header
    class="flex flex-col gap-4 rounded-2xl bg-base-100 p-5 shadow-xl ring-1 ring-base-300/40 md:flex-row md:items-center md:justify-between"
  >
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
        Tiny Idle Mart
      </p>
      <h1 class="text-2xl font-semibold md:text-3xl">
        Minute-based idle loop
      </h1>
      <p class="text-sm text-base-content/60">
        1000 ms = 1 minute. No speed changes. Pause stops time.
      </p>
    </div>
    <button class="btn btn-success w-full md:w-auto" type="button" @click="emit('toggle-pause')">
      {{ props.pausedByPlayer ? "Resume" : "Pause" }}
    </button>
  </header>
</template>
