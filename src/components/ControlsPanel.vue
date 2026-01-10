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
  <section
    class="grid gap-4 rounded-2xl bg-base-100 p-5 shadow-lg ring-1 ring-base-300/40 md:grid-cols-3"
  >
    <div class="flex flex-col gap-3">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Product</span>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          v-for="item in props.products"
          :key="item.id"
          type="button"
          :class="[
            'btn btn-sm justify-start',
            item.id === props.currentProductId
              ? 'btn-warning'
              : 'btn-outline btn-warning',
          ]"
          @click="selectProduct(item.id)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <label class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60" for="buy-amount">
        Restock amount
      </label>
      <div class="flex flex-wrap gap-2">
        <input
          id="buy-amount"
          class="input input-md w-full sm:w-auto"
          :value="props.buyAmount"
          type="number"
          min="1"
          step="1"
          @input="onInput"
        />
        <button class="btn btn-success btn-md" type="button" @click="emit('buy', props.buyAmount)">
          Buy
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="btn btn-soft btn-warning btn-xs" type="button" @click="emit('buy', 1)">
          +1
        </button>
        <button class="btn btn-soft btn-warning btn-xs" type="button" @click="emit('buy', 5)">
          +5
        </button>
        <button class="btn btn-soft btn-warning btn-xs" type="button" @click="emit('buy', 10)">
          +10
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Status</span>
      <div class="flex flex-col gap-2">
        <span
          :class="[
            'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
            props.isPaused ? 'bg-error/20 text-error' : 'bg-success/20 text-success',
          ]"
        >
          {{ props.isPaused ? "Paused" : "Running" }}
        </span>
        <span class="text-sm text-base-content/60">Event: {{ props.eventTitle }}</span>
      </div>
    </div>
  </section>
</template>
