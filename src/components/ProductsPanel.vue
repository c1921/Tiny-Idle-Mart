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
  <section class="rounded-box bg-base-100 p-5 shadow-lg ring-1 ring-base-300/40">
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
    <div class="mt-4 w-full overflow-x-auto">
      <table class="table min-w-[760px]">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Buy / Sell</th>
            <th>Profit</th>
            <th>Margin</th>
            <th>Total Sold</th>
            <th>Daily Sold</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in props.products" :key="item.id">
            <td class="font-semibold">{{ item.name }}</td>
            <td>{{ item.stock }}</td>
            <td class="whitespace-nowrap">${{ item.buyCost }} / ${{ item.sellPrice }}</td>
            <td>${{ item.profit }}</td>
            <td>{{ Math.round(item.margin * 100) }}%</td>
            <td>{{ item.totalSales }}</td>
            <td>{{ item.dailySales }}</td>
            <td class="text-right">
              <button
                class="btn btn-success btn-sm whitespace-nowrap"
                type="button"
                @click="emit('buy', item.id, props.buyAmount)"
              >
                Restock +{{ props.buyAmount }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
