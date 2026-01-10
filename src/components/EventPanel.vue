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
  <div
    id="event-modal"
    class="overlay modal overlay-open:opacity-100 hidden overlay-open:duration-300"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ props.eventTitle }}</h3>
          <button
            type="button"
            class="btn btn-text btn-circle btn-sm absolute end-3 top-3"
            aria-label="Close"
            data-overlay="#event-modal"
          >
            <span class="icon-[tabler--x] size-4"></span>
          </button>
        </div>
        <div class="modal-body space-y-3">
          <p class="text-sm text-base-content/60">{{ props.eventBody }}</p>
          <div class="grid gap-2">
            <button
              v-for="(option, index) in props.eventOptions"
              :key="option.label"
              class="btn btn-warning btn-block flex-col items-start gap-1 text-left"
              type="button"
              data-overlay="#event-modal"
              @click="emit('select', index)"
            >
              {{ option.label }}
              <span v-if="option.note" class="text-xs font-medium text-base-content/70">
                {{ option.note }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
