<script setup lang="ts">
const props = defineProps<{
  buyAmount: number;
  products: {
    id: string;
    name: string;
    buyCost: number;
    sellPrice: number;
    stock: number;
  }[];
}>();

const emit = defineEmits<{
  (e: "update:buyAmount", value: number): void;
  (e: "buy", productId: string, amount: number): void;
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:buyAmount", Number(target.value));
}
</script>

<template>
  <section class="panel products">
    <div class="panel-header">
      <div>
        <span class="label">Products</span>
        <p class="hint">Each item is managed independently.</p>
      </div>
      <div class="restock">
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
        </div>
        <div class="quick">
          <button type="button" @click="emit('update:buyAmount', 1)">+1</button>
          <button type="button" @click="emit('update:buyAmount', 5)">+5</button>
          <button type="button" @click="emit('update:buyAmount', 10)">+10</button>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="row header">
        <span>Product</span>
        <span>Stock</span>
        <span>Buy / Sell</span>
        <span>Action</span>
      </div>
      <div v-for="item in props.products" :key="item.id" class="row">
        <span class="name">{{ item.name }}</span>
        <span class="stock">{{ item.stock }}</span>
        <span class="price">${{ item.buyCost }} / ${{ item.sellPrice }}</span>
        <button type="button" @click="emit('buy', item.id, props.buyAmount)">
          Restock +{{ props.buyAmount }}
        </button>
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

.panel-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #807a71;
}

.hint {
  margin: 6px 0 0;
  color: #6f6a62;
}

.restock {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 240px;
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

button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  background: #f2b66d;
  color: #1b1b1b;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.quick {
  display: flex;
  gap: 8px;
}

.list {
  display: grid;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8f4ee;
  border: 1px solid #e3d7c8;
}

.row.header {
  background: transparent;
  border: none;
  padding: 0 14px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #807a71;
}

.row.header span:last-child {
  text-align: right;
}

.row button {
  justify-self: end;
}

.name {
  font-weight: 600;
  color: #3b2f26;
}

@media (max-width: 720px) {
  .row {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
  }

  .row.header {
    display: none;
  }

  .row button {
    justify-self: start;
  }
}
</style>
