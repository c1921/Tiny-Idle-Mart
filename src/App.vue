<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue";
import ActivityLog from "./components/ActivityLog.vue";
import AppTitlebar from "./components/AppTitlebar.vue";
import BottomBar from "./components/BottomBar.vue";
import EventPanel from "./components/EventPanel.vue";
import ProductsPanel from "./components/ProductsPanel.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { useGame } from "./composables/useGame";

onMounted(() => {
  setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

const {
  money,
  buyAmount,
  productRows,
  pausedByPlayer,
  pausedByEvent,
  eventTitle,
  eventBody,
  eventOptionsView,
  log,
  isPaused,
  timeLabel,
  buyStock,
  togglePause,
  handleEventOption,
} = useGame();

watch(pausedByEvent, async (isActive) => {
  if (!isActive) return;
  await nextTick();
  window.HSStaticMethods?.autoInit();
});
</script>

<template>
  <div class="flex h-screen flex-col bg-base-200 font-sans text-base-content">
    <header>
      <AppTitlebar />
    </header>
    <div class="flex-1 min-h-0 overflow-y-auto">
      <main class="mx-auto flex w-full max-w-225 flex-col gap-5 px-5 py-5">
        <StatsPanel
          :time-label="timeLabel"
          :money="money"
          :is-paused="isPaused"
          :event-title="eventTitle"
        />
        <ProductsPanel
          v-model:buy-amount="buyAmount"
          :products="productRows"
          @buy="buyStock"
        />
        <ActivityLog :log="log" />
      </main>
    </div>
    <footer>
      <BottomBar
        :time-label="timeLabel"
        :money="money"
        :event-title="eventTitle"
        :has-event="pausedByEvent"
        :paused-by-player="pausedByPlayer"
        @toggle-pause="togglePause"
      />
    </footer>
    <EventPanel
      v-if="pausedByEvent"
      :event-title="eventTitle"
      :event-body="eventBody"
      :event-options="eventOptionsView"
      @select="handleEventOption"
    />
  </div>
</template>
