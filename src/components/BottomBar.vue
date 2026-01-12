<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { openPopup } from "../windows/popup";

const props = defineProps<{
  timeLabel: string;
  money: number;
  eventTitle: string;
  eventBody: string;
  eventOptions: { label: string; note?: string }[];
  hasEvent: boolean;
  pausedByPlayer: boolean;
}>();
const emit = defineEmits<{ (e: "toggle-pause"): void }>();

const RING_DURATION_MS = 1000;
const showRinging = ref(false);
let ringTimer: number | null = null;

const triggerRinging = () => {
  if (ringTimer !== null) {
    window.clearTimeout(ringTimer);
    ringTimer = null;
  }
  showRinging.value = true;
  ringTimer = window.setTimeout(() => {
    showRinging.value = false;
    ringTimer = null;
  }, RING_DURATION_MS);
};

watch(
  () => props.hasEvent,
  (hasEvent) => {
    if (!hasEvent) {
      if (ringTimer !== null) {
        window.clearTimeout(ringTimer);
        ringTimer = null;
      }
      showRinging.value = false;
      return;
    }
    triggerRinging();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (ringTimer !== null) {
    window.clearTimeout(ringTimer);
  }
});

const handleTimeClick = () => {
  if (props.hasEvent) {
    triggerRinging();
    return;
  }
  emit("toggle-pause");
};

const handleEventClick = async () => {
  if (!props.hasEvent) return;
  triggerRinging();
  await openPopup({
    kind: "event",
    title: props.eventTitle,
    body: props.eventBody,
    options: props.eventOptions,
  });
};
</script>

<template>
  <div class="bg-base-300 border-t border-base-100">
    <div class="mx-auto flex w-full flex-wrap items-center gap-3 px-4">
      <button :class="[
        'btn btn-text',
        props.hasEvent
          ? 'pointer-events-auto cursor-not-allowed opacity-50'
          : 'cursor-pointer',
      ]" type="button" :aria-disabled="props.hasEvent" @click="handleTimeClick">
        <span :class="[
          props.hasEvent || props.pausedByPlayer
            ? 'icon-[tabler--player-play]'
            : 'icon-[tabler--player-pause]',
          props.hasEvent
            ? 'text-warning'
            : props.pausedByPlayer
              ? 'text-error'
              : 'text-base-content',
              'size-5 shrink-0',
        ]" aria-hidden="true"></span>
        {{ props.timeLabel }}
      </button>
      <button class="btn btn-text">
        <span class="icon-[tabler--coin] size-5 shrink-0"></span>
        ${{ props.money }}
      </button>
      <button
        class="btn btn-text ml-auto"
        type="button"
        :disabled="!props.hasEvent"
        @click="handleEventClick"
      >
        <span :class="[
          props.hasEvent
            ? showRinging
              ? 'icon-[tabler--bell-ringing-filled]'
              : 'icon-[tabler--bell-filled]'
            : 'icon-[tabler--bell]',
          'size-5 shrink-0',
          props.hasEvent ? 'text-info' : '',
          showRinging ? 'motion-preset-shake motion-duration-1000' : '',
        ]"></span>
        <span class="truncate">
          {{ props.hasEvent ? props.eventTitle : "No event" }}
        </span>
      </button>
    </div>
  </div>
</template>
