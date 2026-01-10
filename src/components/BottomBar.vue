<script setup lang="ts">
const props = defineProps<{
  timeLabel: string;
  money: number;
  eventTitle: string;
  hasEvent: boolean;
  pausedByPlayer: boolean;
}>();
const emit = defineEmits<{ (e: "toggle-pause"): void }>();
</script>

<template>
  <div class="bg-base-300">
    <div class="mx-auto flex w-full flex-wrap items-center gap-3 px-4">
      <button :class="[
        'btn btn-text',
        props.hasEvent ? 'cursor-not-allowed opacity-80' : 'cursor-pointer',
      ]" type="button" :disabled="props.hasEvent" @click="emit('toggle-pause')">
        <span :class="[
          props.hasEvent || props.pausedByPlayer
            ? 'icon-[tabler--player-play]'
            : 'icon-[tabler--player-pause]',
          props.hasEvent
            ? 'text-warning'
            : props.pausedByPlayer
              ? 'text-error'
              : 'text-base-content',
              'size-4.5 shrink-0',
        ]" aria-hidden="true"></span>
        {{ props.timeLabel }}
      </button>
      <button class="btn btn-text">
        <span class="icon-[tabler--coin] size-4.5 shrink-0"></span>
        ${{ props.money }}
      </button>
      <button
        class="btn btn-text"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="event-modal"
        data-overlay="#event-modal"
        :disabled="!props.hasEvent"
      >
        <div class="indicator">
          <span :class="[
            'indicator-item size-2 rounded-full',
            props.hasEvent ? 'bg-primary' : 'bg-base-300',
          ]"></span>
          <span :class="[
            'icon-[tabler--bell] size-4.5 shrink-0',
            props.hasEvent ? 'text-primary' : '',
          ]"></span>
        </div>
        <span class="truncate">
          {{ props.hasEvent ? props.eventTitle : "No event" }}
        </span>
      </button>
    </div>
  </div>
</template>
