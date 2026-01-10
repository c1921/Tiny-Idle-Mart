<script setup lang="ts">
const props = defineProps<{
  buyAmount: number;
  isPaused: boolean;
  eventTitle: string;
  products: { id: string; name: string }[];
  currentProductId: string;
}>();

const emit = defineEmits<{
  (e: "update:buyAmount", value: number): void;
  (e: "update:currentProductId", value: string): void;
  (e: "buy", amount: number): void;
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:buyAmount", Number(target.value));
}

function selectProduct(id: string) {
  emit("update:currentProductId", id);
}
</script>

<template>
  <section class="panel controls">
    <div class="control">
      <span class="label">Product</span>
      <div class="product-list">
        <button
          v-for="item in props.products"
          :key="item.id"
          type="button"
          :class="[
            'product-item',
            item.id === props.currentProductId ? 'active' : '',
          ]"
          @click="selectProduct(item.id)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    <div class="control">
      <label class="label" for="buy-amount">Restock amount</label>
      <div class="control-row">
        <input
          id="buy-amount"
          :value="props.buyAmount"
          type="number"
          min="1"
          step="1"
          @input="onInput"
        />
        <button type="button" @click="emit('buy', props.buyAmount)">Buy</button>
      </div>
      <div class="quick">
        <button type="button" @click="emit('buy', 1)">+1</button>
        <button type="button" @click="emit('buy', 5)">+5</button>
        <button type="button" @click="emit('buy', 10)">+10</button>
      </div>
    </div>
    <div class="control">
      <span class="label">Status</span>
      <div class="status">
        <span :class="['badge', props.isPaused ? 'paused' : 'running']">
          {{ props.isPaused ? "Paused" : "Running" }}
        </span>
        <span class="event">Event: {{ props.eventTitle }}</span>
      </div>
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

.controls {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7d0c6;
  font-size: 1rem;
}

select {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7d0c6;
  font-size: 1rem;
  background: #ffffff;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  background: #f2b66d;
  color: #1b1b1b;
  font-weight: 600;
  cursor: pointer;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.product-item {
  background: #f8f4ee;
  border: 1px solid #e3d7c8;
  color: #3b2f26;
  text-align: left;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.product-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(25, 20, 15, 0.12);
}

.product-item.active {
  background: #f2b66d;
  border-color: #e09b3c;
  box-shadow: 0 8px 18px rgba(240, 173, 85, 0.35);
}

.quick {
  display: flex;
  gap: 8px;
}

.status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  width: fit-content;
}

.badge.running {
  background: #cfe8d5;
  color: #1b3c2f;
}

.badge.paused {
  background: #f7d1c0;
  color: #7a1d1d;
}

.event {
  color: #6f6a62;
}
</style>
