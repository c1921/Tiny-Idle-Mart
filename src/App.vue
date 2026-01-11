<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue";
import ActivityLog from "./components/ActivityLog.vue";
import AppTitlebar from "./components/AppTitlebar.vue";
import BottomBar from "./components/BottomBar.vue";
import EventPanel from "./components/EventPanel.vue";
import ProductsPanel from "./components/ProductsPanel.vue";
import StatsPanel from "./components/StatsPanel.vue";
import VerticalTabs from "./components/VerticalTabs.vue";
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
    <div class="flex-1 min-h-0 overflow-hidden">
      <div class="flex h-full">
        <aside class="bg-base-200 p-2 border-r border-base-100">
          <VerticalTabs />
        </aside>
        <main class="flex-1 min-h-0 overflow-y-auto p-2">
          <div class="mx-auto flex w-full flex-col gap-2">
            <section
              id="tabs-vertical-1"
              role="tabpanel"
              aria-labelledby="tabs-vertical-item-1"
              class="flex flex-col gap-2"
            >
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
            </section>
            <section
              id="tabs-vertical-2"
              class="hidden rounded-box bg-base-100 p-6 text-base-content/70"
              role="tabpanel"
              aria-labelledby="tabs-vertical-item-2"
            >
              Profile content is coming soon.
            </section>
            <section
              id="tabs-vertical-3"
              class="hidden rounded-box bg-base-100 p-6 text-base-content/70"
              role="tabpanel"
              aria-labelledby="tabs-vertical-item-3"
            >
              Messages will appear here.
            </section>
          </div>
        </main>
      </div>
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
