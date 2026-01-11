<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MAIN_EVENT_NAME, POPUP_EVENT_NAME } from "../windows/popup";

const lastPayload = ref<unknown>(null);

const formattedPayload = computed(() => {
  if (lastPayload.value === null) return "No message yet.";
  try {
    return JSON.stringify(lastPayload.value, null, 2);
  } catch {
    return String(lastPayload.value);
  }
});

let unlisten: (() => void) | null = null;

onMounted(async () => {
  // Signal that the first render is complete so the main window can show this popup.
  await emit("popup:ready");
  unlisten = await listen(POPUP_EVENT_NAME, (event) => {
    lastPayload.value = event.payload;
  });
});

onBeforeUnmount(() => {
  unlisten?.();
});

async function sendPong() {
  await emit(MAIN_EVENT_NAME, { from: "popup", action: "pong" });
}

async function closePopup() {
  await emit(MAIN_EVENT_NAME, { from: "popup", action: "close" });
  await getCurrentWindow().close();
}
</script>

<template>
  <div class="min-h-screen bg-base-200 p-6 text-base-content">
    <div class="mx-auto flex w-full max-w-md flex-col gap-4 rounded-box bg-base-100 p-4 shadow">
      <div class="flex flex-col gap-1">
        <h1 class="text-lg font-semibold">Popup Window</h1>
        <p class="text-sm text-base-content/70">
          This is a test page rendered at the <code>/popup</code> route.
        </p>
      </div>
      <div class="rounded-box bg-base-200 p-3 text-xs">
        <div class="text-[11px] uppercase tracking-wide text-base-content/60">
          Message from main window
        </div>
        <pre
          class="mt-2 whitespace-pre-wrap font-mono text-[11px]"
          v-text="formattedPayload"
        ></pre>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn btn-primary" @click="sendPong">
          Send Pong
        </button>
        <button type="button" class="btn btn-ghost" @click="closePopup">
          Close Window
        </button>
      </div>
    </div>
  </div>
</template>
