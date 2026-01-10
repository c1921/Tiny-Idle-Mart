<script setup lang="ts">
import { onMounted } from "vue";
import ActivityLog from "./components/ActivityLog.vue";
import AppTitlebar from "./components/AppTitlebar.vue";
import EventPanel from "./components/EventPanel.vue";
import GameHeader from "./components/GameHeader.vue";
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
</script>

<template>
  <div class="h-screen overflow-hidden bg-base-200 font-sans text-base-content">
    <AppTitlebar />
    <div class="h-full overflow-y-auto mt-10">
      <main class="mx-auto flex w-full max-w-225 flex-col gap-5 px-5 pb-12 pt-5">
        <GameHeader
          :paused-by-player="pausedByPlayer"
          @toggle-pause="togglePause"
        />
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
        <EventPanel
          v-if="pausedByEvent"
          :event-title="eventTitle"
          :event-body="eventBody"
          :event-options="eventOptionsView"
          @select="handleEventOption"
        />
        <ActivityLog :log="log" />
      </main>
    </div>
  </div>
</template>
