<script setup lang="ts">
const props = defineProps<{ log: string[] }>();
</script>

<template>
  <section class="panel log">
    <h2>Recent activity</h2>
    <ul>
      <li v-if="props.log.length === 0">No activity yet.</li>
      <li v-for="(entry, index) in props.log" :key="index">
        {{ entry }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  border-radius: 16px;
  padding: 18px 20px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(20, 20, 20, 0.06);
  display: grid;
  gap: 16px;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}

li {
  padding: 10px 12px;
  border-radius: 12px;
  background: #f7f4ed;
}
</style>
