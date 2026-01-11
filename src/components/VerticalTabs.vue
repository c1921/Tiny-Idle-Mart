<template>
  <section class="">
    <nav
      class="tabs flex-col items-start space-y-1"
      aria-label="Tabs"
      role="tablist"
      data-tabs-vertical="true"
      aria-orientation="horizontal"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        type="button"
        class="h-10 opacity-50 active-tab:text-primary active-tab:opacity-100 hover:opacity-70"
        :class="{ active: index === 0 }"
        :id="`tabs-vertical-item-${tab.id}`"
        :data-tab="`#tabs-vertical-${tab.id}`"
        :aria-controls="`tabs-vertical-${tab.id}`"
        role="tab"
        :aria-selected="index === 0 ? 'true' : 'false'"
        :aria-label="tab.label"
      >
        <span :class="tab.icon" class="size-6 shrink-0"></span>
      </button>
    </nav>
  </section>
</template>

<script setup>
const tabs = [
  { id: 1, label: "Home", icon: "icon-[tabler--home]" },
  { id: 2, label: "Profile", icon: "icon-[tabler--user]" },
  { id: 3, label: "Messages", icon: "icon-[tabler--message]" },
];
</script>
