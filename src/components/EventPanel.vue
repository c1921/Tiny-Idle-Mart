<script setup lang="ts">
type EventOption = { label: string; note?: string };

const props = defineProps<{
  eventTitle: string;
  eventBody: string;
  eventOptions: EventOption[];
}>();

const emit = defineEmits<{ (e: "select", index: number): void }>();
</script>

<template>
  <section class="panel event-panel">
    <h2>{{ props.eventTitle }}</h2>
    <p>{{ props.eventBody }}</p>
    <div class="event-options">
      <button
        v-for="(option, index) in props.eventOptions"
        :key="option.label"
        type="button"
        @click="emit('select', index)"
      >
        {{ option.label }}
        <span v-if="option.note" class="note">{{ option.note }}</span>
      </button>
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
  gap: 10px;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

p {
  margin: 0;
  color: #5b5750;
}

.event-options {
  display: grid;
  gap: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  background: #f2b66d;
  color: #1b1b1b;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.note {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c655c;
}
</style>
