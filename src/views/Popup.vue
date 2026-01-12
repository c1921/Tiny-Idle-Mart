<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import AppTitlebar from "../components/AppTitlebar.vue";
import { MAIN_EVENT_NAME, POPUP_EVENT_NAME } from "../windows/popup";

type EventOption = { label: string; note?: string };
type EventPayload = {
  kind: "event";
  title: string;
  body: string;
  options: EventOption[];
};

const lastPayload = ref<unknown>(null);
const waitingForEvent = computed(() => lastPayload.value === null);

const eventPayload = computed<EventPayload | null>(() => {
  const payload = lastPayload.value as {
    kind?: unknown;
    title?: unknown;
    body?: unknown;
    options?: unknown;
  } | null;
  if (!payload || payload.kind !== "event") return null;
  const title = typeof payload.title === "string" ? payload.title : "Event";
  const body = typeof payload.body === "string" ? payload.body : "";
  const options: EventOption[] = Array.isArray(payload.options)
    ? payload.options.reduce<EventOption[]>((acc, option) => {
        if (!option || typeof option !== "object") return acc;
        const candidate = option as Partial<EventOption>;
        if (typeof candidate.label !== "string" || !candidate.label) return acc;
        acc.push({
          label: candidate.label,
          note: typeof candidate.note === "string" ? candidate.note : undefined,
        });
        return acc;
      }, [])
    : [];
  return { kind: "event", title, body, options };
});

const formattedPayload = computed(() => {
  if (lastPayload.value === null) return "";
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

async function closePopup() {
  await emit(MAIN_EVENT_NAME, { from: "popup", action: "close" });
  await getCurrentWindow().close();
}

async function selectEventOption(index: number) {
  await emit(MAIN_EVENT_NAME, {
    from: "popup",
    action: "select-event-option",
    index,
  });
  await closePopup();
}
</script>

<template>
  <div class="flex h-screen flex-col bg-base-200 text-base-content">
    <header>
      <AppTitlebar :show-minimize="false" :show-maximize="false" />
    </header>
    <main class="flex-1 min-h-0 overflow-y-auto p-4">
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-lg font-semibold">
            {{ eventPayload ? eventPayload.title : "Event" }}
          </h1>
          <p v-if="eventPayload">
            {{ eventPayload.body }}
          </p>
          <p v-else class="text-sm text-base-content/70">
            Waiting for event details...
          </p>
        </div>
        <div v-if="eventPayload" class="p-3">
          <div v-if="eventPayload.options.length" class="grid gap-2">
            <button
              v-for="(option, index) in eventPayload.options"
              :key="option.label"
              type="button"
              class="btn h-auto btn-block flex-col items-start gap-1 text-left"
              @click="selectEventOption(index)"
            >
              {{ option.label }}
              <span v-if="option.note" class="text-xs font-medium">
                {{ option.note }}
              </span>
            </button>
          </div>
          <div v-else class="mt-2 text-xs text-base-content/60">
            No options available.
          </div>
        </div>
        <div v-else-if="!waitingForEvent && formattedPayload" class="rounded-box bg-base-200 p-3 text-xs">
          <div class="text-[11px] uppercase tracking-wide text-base-content/60">
            Unknown payload
          </div>
          <pre
            class="mt-2 whitespace-pre-wrap font-mono text-[11px]"
            v-text="formattedPayload"
          ></pre>
        </div>
      </div>
    </main>
  </div>
</template>
