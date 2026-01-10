<script setup lang="ts">
const props = defineProps<{
  timeLabel: string;
  money: number;
  eventTitle: string;
  hasEvent: boolean;
}>();
</script>

<template>
  <div class="bg-base-300">
    <div
      class="mx-auto flex h-12 w-full max-w-225 flex-wrap items-center justify-between gap-3 px-4 text-xs sm:text-sm"
    >
      <div class="flex items-center gap-2">
        <span class="icon-[tabler--clock] text-base-content/60"></span>
        <span class="font-semibold">{{ props.timeLabel }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="icon-[tabler--coin] text-base-content/60"></span>
        <span class="font-semibold">${{ props.money }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="relative inline-flex items-center">
          <span class="icon-[tabler--bell] text-base-content/60"></span>
          <span
            :class="[
              'absolute -right-1 -top-1 h-2 w-2 rounded-full',
              props.hasEvent ? 'bg-warning' : 'bg-base-300',
            ]"
          ></span>
        </span>
        <span class="font-semibold">
          {{ props.hasEvent ? props.eventTitle : "No event" }}
        </span>
      </div>
    </div>
  </div>
</template>
