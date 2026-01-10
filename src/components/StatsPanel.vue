<script setup lang="ts">
const props = defineProps<{
  timeLabel: string;
  money: number;
  isPaused: boolean;
  eventTitle: string;
}>();
</script>

<template>
  <section class="panel">
    <div class="stat">
      <span class="label">Time</span>
      <span class="value">{{ props.timeLabel }}</span>
    </div>
    <div class="stat">
      <span class="label">Cash</span>
      <span class="value">${{ props.money }}</span>
    </div>
    <div class="stat">
      <span class="label">Status</span>
      <span class="value">{{ props.isPaused ? "Paused" : "Running" }}</span>
    </div>
    <div class="stat">
      <span class="label">Event</span>
      <span class="value">{{ props.eventTitle }}</span>
    </div>
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

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #807a71;
}

.value {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
