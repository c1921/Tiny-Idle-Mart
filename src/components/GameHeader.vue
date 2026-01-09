<script setup lang="ts">
const props = defineProps<{ pausedByPlayer: boolean }>();
const emit = defineEmits<{ (e: "toggle-pause"): void }>();
</script>

<template>
  <header class="hero">
    <div>
      <p class="kicker">Tiny Idle Mart</p>
      <h1>Minute-based idle loop</h1>
      <p class="sub">1000 ms = 1 minute. No speed changes. Pause stops time.</p>
    </div>
    <button class="pause" type="button" @click="emit('toggle-pause')">
      {{ props.pausedByPlayer ? "Resume" : "Pause" }}
    </button>
  </header>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-radius: 18px;
  background: #fff8ec;
  box-shadow: 0 14px 30px rgba(20, 20, 20, 0.08);
}

.kicker {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  margin: 0 0 6px;
  color: #6c655c;
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.sub {
  margin: 0;
  color: #5b5750;
}

.pause {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 600;
  background: #1b3c2f;
  color: #fdf7ee;
  cursor: pointer;
}

@media (max-width: 720px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .pause {
    width: 100%;
    text-align: center;
  }
}
</style>
