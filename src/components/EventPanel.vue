<script setup lang="ts">
type EventOption = { label: string; note?: string };

const props = defineProps<{
  eventTitle: string;
  eventBody: string;
  eventOptions: EventOption[];
}>();

const emit = defineEmits<{ (e: "select", index: number): void }>();
</script>

<template>
  <section class="grid gap-3 rounded-box bg-base-100 p-5 shadow-lg ring-1 ring-base-300/40">
    <h2 class="text-lg font-semibold">{{ props.eventTitle }}</h2>
    <p class="text-sm text-base-content/60">{{ props.eventBody }}</p>
    <div class="grid gap-2">
      <button
        v-for="(option, index) in props.eventOptions"
        :key="option.label"
        class="btn btn-warning btn-block flex-col items-start gap-1 text-left"
        type="button"
        @click="emit('select', index)"
      >
        {{ option.label }}
        <span v-if="option.note" class="text-xs font-medium text-base-content/70">
          {{ option.note }}
        </span>
      </button>
    </div>
  </section>
</template>
