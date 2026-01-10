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
    class="flex h-10 items-center justify-end bg-base-300 px-2"
  >
    <div class="flex gap-1">
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-text btn-xs btn-square"
        aria-label="Minimize"
        @click="minimize"
      >
        <span class="icon-[tabler--minus] text-base"></span>
      </button>
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-text btn-xs btn-square"
        aria-label="Maximize"
        @click="toggleMaximize"
      >
        <span class="icon-[tabler--square] text-base"></span>
      </button>
      <button
        data-tauri-drag-region="false"
        type="button"
        class="btn btn-text btn-xs btn-square hover:bg-error hover:text-error-content"
        aria-label="Close"
        @click="closeWindow"
      >
        <span class="icon-[tabler--x] text-base"></span>
      </button>
    </div>
  </div>
</template>
