<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { listen } from "@tauri-apps/api/event";
import ActivityLog from "./components/ActivityLog.vue";
import AppTitlebar from "./components/AppTitlebar.vue";
import BottomBar from "./components/BottomBar.vue";
import ProductsPanel from "./components/ProductsPanel.vue";
import StatsPanel from "./components/StatsPanel.vue";
import VerticalTabs from "./components/VerticalTabs.vue";
import { useGame } from "./composables/useGame";
import PopupView from "./views/Popup.vue";
import { MAIN_EVENT_NAME, openPopup } from "./windows/popup";

const route = useRoute();
const isPopupRoute = computed(() => route.path === "/popup");

const popupResponse = ref<unknown>(null);

const formattedPopupResponse = computed(() => {
  if (popupResponse.value === null) return "No message yet.";
  try {
    return JSON.stringify(popupResponse.value, null, 2);
  } catch {
    return String(popupResponse.value);
  }
});

let unlistenPopup: (() => void) | null = null;

onMounted(async () => {
  if (isPopupRoute.value) return;
  setTimeout(() => window.HSStaticMethods.autoInit(), 100);
  unlistenPopup = await listen(MAIN_EVENT_NAME, (event) => {
    const payload = event.payload as
      | { action?: string; index?: number }
      | null
      | undefined;
    if (payload?.action === "select-event-option") {
      if (typeof payload.index === "number") {
        handleEventOption(payload.index);
      }
    }
    popupResponse.value = event.payload;
  });
});

onBeforeUnmount(() => {
  unlistenPopup?.();
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
  if (isPopupRoute.value || !isActive) return;
  await nextTick();
  window.HSStaticMethods?.autoInit();
});

async function handleOpenPopup() {
  const payload = {
    from: "main",
    text: "Hello from the main window.",
    at: new Date().toISOString(),
  };
  await openPopup(payload);
}
</script>

<template>
  <PopupView v-if="isPopupRoute" />
  <div v-else class="flex h-screen flex-col bg-base-200 font-sans text-base-content">
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
              <div class="rounded-box bg-base-100 p-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div class="text-sm font-semibold">Popup Demo</div>
                    <div class="text-xs text-base-content/70">
                      Open a native window and send a test payload.
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="handleOpenPopup"
                  >
                    Open Popup
                  </button>
                </div>
                <div class="mt-2 rounded-box bg-base-200 p-2 text-[11px]">
                  <div class="text-[10px] uppercase tracking-wide text-base-content/60">
                    Message from popup
                  </div>
                  <pre
                    class="mt-1 whitespace-pre-wrap font-mono text-[11px]"
                    v-text="formattedPopupResponse"
                  ></pre>
                </div>
              </div>
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
        :event-body="eventBody"
        :event-options="eventOptionsView"
        :has-event="pausedByEvent"
        :paused-by-player="pausedByPlayer"
        @toggle-pause="togglePause"
      />
    </footer>
  </div>
</template>
