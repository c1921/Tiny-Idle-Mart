<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function minimize() {
  appWindow.minimize();
}

function toggleMaximize() {
  appWindow.toggleMaximize();
}

function closeWindow() {
  appWindow.close();
}
</script>

<template>
  <div
    data-tauri-drag-region
    class="flex items-center justify-end bg-base-300"
  >
    <div class="flex gap-1">
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-square btn-text hover:bg-base-100"
        aria-label="Minimize"
        @click="minimize"
      >
        <span class="icon-[tabler--minus] size-4.5 shrink-0"></span>
      </button>
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-square btn-text hover:bg-base-100"
        aria-label="Maximize"
        @click="toggleMaximize"
      >
        <span class="icon-[tabler--square] size-4.5 shrink-0"></span>
      </button>
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-square btn-text hover:bg-error hover:text-error-content"
        aria-label="Close"
        @click="closeWindow"
      >
        <span class="icon-[tabler--x] size-4.5 shrink-0"></span>
      </button>
    </div>
  </div>
</template>
