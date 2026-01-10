<script setup lang="ts">
import ActivityLog from "./components/ActivityLog.vue";
import EventPanel from "./components/EventPanel.vue";
import GameHeader from "./components/GameHeader.vue";
import ProductsPanel from "./components/ProductsPanel.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { useGame } from "./composables/useGame";

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
  <main class="app">
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
</template>

<style scoped>
.app {
  width: min(900px, 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
