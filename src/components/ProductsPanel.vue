<script setup lang="ts">
const props = defineProps<{
  buyAmount: number;
  products: {
    id: string;
    name: string;
    buyCost: number;
    sellPrice: number;
    stock: number;
    profit: number;
    margin: number;
    totalSales: number;
    dailySales: number;
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
  <section class="rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-300/40">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
          Products
        </span>
        <p class="mt-1 text-sm text-base-content/60">Each item is managed independently.</p>
      </div>
      <div class="flex w-full flex-col gap-3 sm:max-w-sm">
        <label class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60" for="buy-amount">
          Restock amount
        </label>
        <div class="flex gap-2">
          <input
            id="buy-amount"
            class="input input-md w-full"
            :value="props.buyAmount"
            type="number"
            min="1"
            step="1"
            @input="onInput"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            class="btn btn-soft btn-warning btn-sm"
            type="button"
            @click="emit('update:buyAmount', 1)"
          >
            +1
          </button>
          <button
            class="btn btn-soft btn-warning btn-sm"
            type="button"
            @click="emit('update:buyAmount', 5)"
          >
            +5
          </button>
          <button
            class="btn btn-soft btn-warning btn-sm"
            type="button"
            @click="emit('update:buyAmount', 10)"
          >
            +10
          </button>
        </div>
      </div>
    </div>
    <div class="mt-4 overflow-x-auto">
      <div class="min-w-[760px] space-y-2">
        <div class="grid grid-cols-[1.6fr_0.8fr_1.2fr_0.9fr_0.8fr_0.9fr_0.9fr_1fr] gap-3 px-3 text-xs font-semibold uppercase tracking-[0.15em] text-base-content/60">
          <span>Product</span>
          <span>Stock</span>
          <span>Buy / Sell</span>
          <span>Profit</span>
          <span>Margin</span>
          <span>Total Sold</span>
          <span>Daily Sold</span>
          <span class="text-right">Action</span>
        </div>
        <div
          v-for="item in props.products"
          :key="item.id"
          class="grid grid-cols-[1.6fr_0.8fr_1.2fr_0.9fr_0.8fr_0.9fr_0.9fr_1fr] items-center gap-3 rounded-xl border border-base-300/50 bg-base-200 px-3 py-2 text-sm"
        >
          <span class="font-semibold">{{ item.name }}</span>
          <span>{{ item.stock }}</span>
          <span class="whitespace-nowrap">
            ${{ item.buyCost }} / ${{ item.sellPrice }}
          </span>
          <span>${{ item.profit }}</span>
          <span>{{ Math.round(item.margin * 100) }}%</span>
          <span>{{ item.totalSales }}</span>
          <span>{{ item.dailySales }}</span>
          <button
            class="btn btn-success btn-sm justify-self-end whitespace-nowrap"
            type="button"
            @click="emit('buy', item.id, props.buyAmount)"
          >
            Restock +{{ props.buyAmount }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
