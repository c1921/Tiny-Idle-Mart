<script setup lang="ts">
const props = defineProps<{ log: string[] }>();
</script>

<template>
  <section class="grid gap-4 rounded-box bg-base-100 p-5">
    <h2 class="text-lg font-semibold">Recent activity</h2>
    <ul class="grid gap-2">
      <li v-if="props.log.length === 0" class="rounded-Fields bg-base-200 px-3 py-2 text-sm text-base-content/60">
        No activity yet.
      </li>
      <li
        v-for="(entry, index) in props.log"
        :key="index"
        class="rounded-Fields bg-base-200 px-3 py-2 text-sm"
      >
        {{ entry }}
      </li>
    </ul>
  </section>
</template>
