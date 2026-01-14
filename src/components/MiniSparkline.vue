<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";

const props = defineProps<{
  values: number[];
  labels: string[];
}>();

const chartId = "#apex-mini-sparkline-area-chart";
let chart: ApexCharts | null = null;

onMounted(() => {
  chart = window.buildChart(chartId, () => ({
    series: [
      {
        name: "Income",
        data: props.values,
      },
    ],
    chart: {
      width: 110,
      height: 32,
      type: "area",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },
    fill: {
      type: "solid",
    },
    colors: ["var(--color-primary)"],
    xaxis: {
      type: "category",
      categories: props.labels,
      crosshairs: {
        show: false,
      },
    },
    markers: {
      hover: {
        size: 0,
      },
    },
    tooltip: {
      marker: {
        show: false,
      },
      fixed: {
        enabled: true,
        position: "bottomLeft",
        offsetX: 10,
        offsetY: -12,
      },
      custom: (tooltipProps: {
        ctx: { opts: { xaxis: { categories: string[] } } };
        dataPointIndex: number;
      }) => {
        const { categories } = tooltipProps.ctx.opts.xaxis;
        const title = categories[tooltipProps.dataPointIndex] ?? "Income";

        return window.buildTooltip(tooltipProps, {
          title,
          valuePrefix: "$",
          hasTextLabel: true,
          wrapperExtClasses: "min-w-28",
          titleExtClasses: "text-left",
          labelDivider: ":",
          labelExtClasses: "ms-2",
        });
      },
    },
  })) as ApexCharts | null;
});

watch(
  () => [props.values, props.labels],
  ([values, labels]) => {
    if (!chart) return;
    chart.updateOptions(
      {
        series: [{ name: "Income", data: values }],
        xaxis: { categories: labels },
      },
      false,
      false
    );
  }
);

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="flex items-center justify-between rounded-box bg-base-100 px-4 py-3">
    <div>
      <div class="text-sm font-semibold text-base-content">Minute trend</div>
      <div class="text-xs text-base-content/70">Last {{ values.length }} minutes</div>
    </div>
    <div id="apex-mini-sparkline-area-chart" aria-hidden="true"></div>
  </div>
</template>
