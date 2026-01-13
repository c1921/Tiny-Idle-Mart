<script setup lang="ts">
import { computed, h, ref } from "vue";
import {
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from "@tanstack/vue-table";
import type { VisibilityState } from "@tanstack/table-core";

type ProductRow = {
  id: string;
  name: string;
  buyCost: number;
  sellPrice: number;
  stock: number;
  profit: number;
  margin: number;
  totalSales: number;
  dailySales: number;
};

const props = defineProps<{
  buyAmount: number;
  products: ProductRow[];
}>();

const emit = defineEmits<{
  (e: "update:buyAmount", value: number): void;
  (e: "buy", productId: string, amount: number): void;
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:buyAmount", Number(target.value));
}

const columnHelper = createColumnHelper<ProductRow>();
const columns = computed(() => [
  columnHelper.accessor("name", {
    enableSorting: true,
    header: "Product",
    cell: (info) => h("span", { class: "font-semibold" }, info.getValue()),
  }),
  columnHelper.accessor("stock", {
    enableSorting: true,
    header: "Stock",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "buySell",
    enableSorting: false,
    enableHiding: true,
    header: "Buy / Sell",
    cell: (info) => {
      const { buyCost, sellPrice } = info.row.original;
      return h(
        "span",
        { class: "whitespace-nowrap" },
        `$${buyCost} / $${sellPrice}`
      );
    },
  }),
  columnHelper.accessor("profit", {
    enableSorting: true,
    header: "Profit",
    cell: (info) => `$${info.getValue()}`,
  }),
  columnHelper.accessor("margin", {
    enableSorting: true,
    header: "Margin",
    cell: (info) => `${Math.round(info.getValue() * 100)}%`,
  }),
  columnHelper.accessor("totalSales", {
    enableSorting: true,
    header: "Total Sold",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dailySales", {
    enableSorting: true,
    header: "Daily Sold",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "action",
    enableSorting: false,
    enableHiding: false,
    header: "Action",
    cell: (info) => {
      const row = info.row.original;
      return h(
        "button",
        {
          class: "btn btn-success btn-sm whitespace-nowrap",
          type: "button",
          onClick: () => emit("buy", row.id, props.buyAmount),
        },
        `Restock +${props.buyAmount}`
      );
    },
  }),
]);

const globalFilter = ref("");
const sorting = ref<SortingState>([]);
const columnVisibility = ref<VisibilityState>({});

const table = useVueTable({
  get data() {
    return props.products;
  },
  get columns() {
    return columns.value;
  },
  state: {
    get globalFilter() {
      return globalFilter.value;
    },
    get sorting() {
      return sorting.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === "function" ? updater(globalFilter.value) : updater;
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility.value =
      typeof updater === "function" ? updater(columnVisibility.value) : updater;
  },
  globalFilterFn: "includesString",
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

function sortIndicator(sorted: false | "asc" | "desc") {
  if (sorted === "asc") return "^";
  if (sorted === "desc") return "v";
  return "";
}

const hideableColumns = computed(() =>
  table.getAllLeafColumns().filter((column) => column.getCanHide())
);

function onHiddenColumnsChange(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  if (!target) return;
  const hiddenIds = new Set(
    Array.from(target.selectedOptions).map((option) => option.value)
  );
  hideableColumns.value.forEach((column) => {
    column.toggleVisibility(!hiddenIds.has(column.id));
  });
}
</script>

<template>
  <section class="rounded-box bg-base-100 p-5">
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
    <div class="mt-4 flex w-full flex-row items-center justify-between gap-3">
      <div class="flex w-full max-w-60 flex-col gap-2">
        <label class="sr-only" for="product-search">Search</label>
        <div class="input input-sm max-w-60">
          <span class="icon-[tabler--search] text-base-content/80 my-auto me-3 size-4 shrink-0"></span>
          <input
            id="product-search"
            class="grow"
            type="search"
            placeholder="Search products..."
            :value="globalFilter"
            @input="globalFilter = ($event.target as HTMLInputElement).value"
          />
        </div>
      </div>
      <div class="flex w-full justify-end sm:w-auto">
        <select
          multiple
          data-select='{
            "placeholder": "Hide Columns",
            "toggleCountText": "selected",
            "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
            "toggleClasses": "advance-select-toggle advance-select-sm max-sm:w-24 w-40",
            "dropdownClasses": "advance-select-menu max-sm:w-28 w-full",
            "optionClasses": "advance-select-option selected:select-active",
            "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] shrink-0 size-3 text-primary hidden selected:block \"></span></div>",
            "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-2 -translate-y-1/2 \"></span>"
          }'
          class="hidden"
          aria-label="Hide columns"
          @change="onHiddenColumnsChange"
        >
          <option value="">Choose</option>
          <option
            v-for="column in hideableColumns"
            :key="column.id"
            :value="column.id"
            :selected="!column.getIsVisible()"
          >
            {{ column.columnDef.header }}
          </option>
        </select>
      </div>
    </div>
    <div class="mt-4 w-full overflow-x-auto">
      <table class="table">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="[
                'group',
                header.column.id === 'action' ? 'text-right' : '',
                header.column.getIsSorted() === 'asc' ? 'dt-ordering-asc' : '',
                header.column.getIsSorted() === 'desc' ? 'dt-ordering-desc' : ''
              ]"
            >
              <div v-if="!header.isPlaceholder">
                <div
                  v-if="header.column.getCanSort()"
                  class="flex items-center justify-between cursor-pointer"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <span class="icon-[tabler--chevron-up] hidden datatable-ordering-asc:block"></span>
                  <span class="icon-[tabler--chevron-down] hidden datatable-ordering-desc:block"></span>
                </div>
                <div v-else>
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="cell.column.id === 'action' ? 'text-right' : ''"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td :colspan="table.getVisibleLeafColumns().length" class="py-10 text-center opacity-70">
              No results.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

