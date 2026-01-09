<script setup lang="ts">
import ActivityLog from "./components/ActivityLog.vue";
import ControlsPanel from "./components/ControlsPanel.vue";
import EventPanel from "./components/EventPanel.vue";
import GameHeader from "./components/GameHeader.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { useGame } from "./composables/useGame";

const {
  money,
  stock,
  buyCost,
  sellPrice,
  buyAmount,
  products,
  currentProductId,
  currentProduct,
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
      :stock="stock"
      :buy-cost="buyCost"
      :sell-price="sellPrice"
      :product-name="currentProduct?.name ?? 'Unknown'"
    />
    <ControlsPanel
      v-model:buy-amount="buyAmount"
      v-model:current-product-id="currentProductId"
      :is-paused="isPaused"
      :event-title="eventTitle"
      :products="products"
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
