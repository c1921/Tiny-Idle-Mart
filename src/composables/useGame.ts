import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Product } from "../models/Product";

type EventOption = { label: string; effect: () => void; note?: string };

const TICK_MS = 1000;
const START_MINUTES = 8 * 60;

export function useGame() {
  const totalMinutes = ref(0);
  const money = ref(50);
  const products = ref<Product[]>([
    new Product("snack", "Snacks", 3, 5),
    new Product("drink", "Drinks", 2, 4),
    new Product("toy", "Toys", 6, 10),
  ]);
  const inventory = ref<Record<string, number>>({
    snack: 10,
    drink: 6,
    toy: 2,
  });
  const totalSales = ref<Record<string, number>>({
    snack: 0,
    drink: 0,
    toy: 0,
  });
  const dailySales = ref<Record<string, number>>({
    snack: 0,
    drink: 0,
    toy: 0,
  });
  const buyAmount = ref(5);
  const currentDay = ref(1);

  const pausedByPlayer = ref(false);
  const pausedByEvent = ref(false);
  const eventTitle = ref("None");
  const eventBody = ref("");
  const eventOptions = ref<EventOption[]>([]);
  const log = ref<string[]>([]);

  let tickId: ReturnType<typeof setInterval> | null = null;

  const isPaused = computed(() => pausedByPlayer.value || pausedByEvent.value);
  const productRows = computed(() =>
    products.value.map((product) => {
      const profit = product.sellPrice - product.buyCost;
      const margin = product.sellPrice > 0 ? profit / product.sellPrice : 0;
      return {
        id: product.id,
        name: product.name,
        buyCost: product.buyCost,
        sellPrice: product.sellPrice,
        stock: inventory.value[product.id] ?? 0,
        profit,
        margin,
        totalSales: totalSales.value[product.id] ?? 0,
        dailySales: dailySales.value[product.id] ?? 0,
      };
    })
  );

  function pushLog(message: string) {
    log.value.unshift(message);
    if (log.value.length > 6) log.value.pop();
  }

  function formatTime(minutesTotal: number) {
    const minutesInDay = 24 * 60;
    const day = Math.floor(minutesTotal / minutesInDay) + 1;
    const minutesInDayValue = minutesTotal % minutesInDay;
    const hour = Math.floor(minutesInDayValue / 60);
    const minute = minutesInDayValue % 60;
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return { day, hh, mm };
  }

  function getDay(minutesTotal: number) {
    const minutesInDay = 24 * 60;
    return Math.floor(minutesTotal / minutesInDay) + 1;
  }

  const timeLabel = computed(() => {
    const { day, hh, mm } = formatTime(totalMinutes.value + START_MINUTES);
    return `Day ${day} ${hh}:${mm}`;
  });

  function startEvent(title: string, body: string, options: EventOption[]) {
    if (pausedByEvent.value) return;
    pausedByEvent.value = true;
    eventTitle.value = title;
    eventBody.value = body;
    eventOptions.value = options;
    pushLog(`Event: ${title}`);
  }

  function clearEvent() {
    pausedByEvent.value = false;
    eventTitle.value = "None";
    eventBody.value = "";
    eventOptions.value = [];
  }

  function handleEventOption(index: number) {
    const option = eventOptions.value[index];
    if (!option) return;
    option.effect();
    pushLog(`Resolved: ${option.label}`);
    clearEvent();
  }

  function maybeTriggerEvent() {
    if (pausedByEvent.value) return;
    if (Math.random() < 0.08) {
      startEvent("Quick inspection", "A city inspector shows up.", [
        {
          label: "Offer samples (-$5)",
          note: "Costs $5, no other risk.",
          effect: () => {
            money.value = Math.max(0, money.value - 5);
          },
        },
        {
          label: "Haggle",
          note: "50% chance to avoid cost; 50% chance to lose 2 stock.",
          effect: () => {
            if (Math.random() < 0.5) return;
            const target =
              products.value[Math.floor(Math.random() * products.value.length)];
            if (!target) return;
            adjustStock(target.id, -2);
          },
        },
      ]);
    }
  }

  function adjustStock(productId: string, delta: number) {
    const next = (inventory.value[productId] ?? 0) + delta;
    inventory.value[productId] = Math.max(0, next);
  }

  function customerStep() {
    if (Math.random() >= 0.45) return;
    if (products.value.length === 0) return;
    const pick =
      products.value[Math.floor(Math.random() * products.value.length)];
    if (!pick) return;

    const desired = 1 + Math.floor(Math.random() * 3);
    const available = inventory.value[pick.id] ?? 0;
    if (available <= 0) {
      pushLog("Customer left: out of stock");
      return;
    }

    const bought = Math.min(desired, available);
    const revenue = bought * pick.sellPrice;
    inventory.value[pick.id] = available - bought;
    totalSales.value[pick.id] = (totalSales.value[pick.id] ?? 0) + bought;
    dailySales.value[pick.id] = (dailySales.value[pick.id] ?? 0) + bought;
    money.value += revenue;
    pushLog(`Customer bought ${bought} ${pick.name} (+$${revenue})`);
  }

  function tick() {
    totalMinutes.value += 1;
    const nextDay = getDay(totalMinutes.value + START_MINUTES);
    if (nextDay !== currentDay.value) {
      currentDay.value = nextDay;
      dailySales.value = Object.fromEntries(
        products.value.map((item) => [item.id, 0])
      ) as Record<string, number>;
    }
    customerStep();
    maybeTriggerEvent();
  }

  function buyStock(productId: string, amount: number) {
    const product = products.value.find((item) => item.id === productId);
    if (!product) return;
    if (!Number.isFinite(amount) || amount <= 0) return;
    const cost = amount * product.buyCost;
    if (money.value < cost) {
      pushLog("Not enough cash to restock");
      return;
    }
    money.value -= cost;
    adjustStock(productId, amount);
    pushLog(`Restocked ${amount} ${product.name} (-$${cost})`);
  }

  function togglePause() {
    pausedByPlayer.value = !pausedByPlayer.value;
  }

  onMounted(() => {
    tickId = setInterval(() => {
      if (!isPaused.value) tick();
    }, TICK_MS);
  });

  onBeforeUnmount(() => {
    if (tickId) clearInterval(tickId);
  });

  const eventOptionsView = computed(() =>
    eventOptions.value.map(({ label, note }) => ({ label, note }))
  );

  return {
    totalMinutes,
    money,
    buyAmount,
    productRows,
    pausedByPlayer,
    pausedByEvent,
    eventTitle,
    eventBody,
    eventOptionsView,
    log,
    isPaused,
    timeLabel,
    buyStock,
    togglePause,
    handleEventOption,
  };
}
