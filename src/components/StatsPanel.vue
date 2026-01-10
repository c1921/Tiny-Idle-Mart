<script setup lang="ts">
const props = defineProps<{
  timeLabel: string;
  money: number;
  isPaused: boolean;
  eventTitle: string;
}>();
</script>

<template>
  <section
    class="grid gap-4 rounded-box bg-base-100 p-5 shadow-lg ring-1 ring-base-300/40 sm:grid-cols-2"
  >
    <div class="flex flex-col gap-1">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
        Time
      </span>
      <span class="text-lg font-semibold">{{ props.timeLabel }}</span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
        Cash
      </span>
      <span class="text-lg font-semibold">${{ props.money }}</span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
        Status
      </span>
      <span class="text-lg font-semibold">{{ props.isPaused ? "Paused" : "Running" }}</span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
        Event
      </span>
      <span class="text-lg font-semibold">{{ props.eventTitle }}</span>
    </div>
  </section>
</template>
