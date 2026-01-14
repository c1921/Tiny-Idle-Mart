<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";

const props = defineProps<{
  values: number[];
  timestamps: number[];
  rangeMs: number;
}>();

let chart: ApexCharts | null = null;

const formatHourMinute = (timestamp: number) => {
  const date = new Date(timestamp);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const buildSeriesData = (values: number[], timestamps: number[]) =>
  timestamps.map((timestamp, index) => ({
    x: timestamp,
    y: values[index] ?? 0,
  }));

onMounted(() => {
  chart = window.buildChart("#apex-single-area-chart", () => ({
    chart: {
      height: 400,
      type: "bar",
      animations: {
        enabled: true,
        easing: "linear",
        speed: 300,
        animateGradually: {
          enabled: false,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 300,
        },
      },
      redrawOnParentResize: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Income",
        data: buildSeriesData(props.values, props.timestamps),
      },
    ],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 2,
      borderColor: "color-mix(in oklab, var(--color-base-content) 40%, transparent)",
    },
    colors: ["var(--color-primary)"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 0,
      },
    },
    xaxis: {
      type: "datetime",
      range: props.rangeMs,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "var(--color-base-content)",
          fontSize: "12px",
          fontWeight: 400,
        },
        formatter: (value: string | number) => {
          if (value === null || value === undefined) return "";
          const timestamp = typeof value === "number" ? value : Number(value);
          if (!Number.isFinite(timestamp)) return String(value);
          return formatHourMinute(timestamp);
        },
      },
    },
    yaxis: {
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: "var(--color-base-content)",
          fontSize: "12px",
          fontWeight: 400,
        },
        formatter: (value: number) =>
          value >= 1000 ? `${value / 1000}k` : `${value}`,
      },
    },
    tooltip: {
      x: {
        format: "MMMM yyyy",
      },
      y: {
        formatter: (value: number) => `${value >= 1000 ? `${value / 1000}k` : value}`,
      },
      custom: (tooltipProps: {
        dataPointIndex: number;
        seriesIndex: number;
        w: {
          globals: {
            seriesX: number[][];
          };
        };
      }) => {
        const seriesX =
          tooltipProps.w.globals.seriesX?.[tooltipProps.seriesIndex]?.[
            tooltipProps.dataPointIndex
          ];
        const timestamp = Array.isArray(seriesX) ? seriesX[0] : seriesX;
        const title = Number.isFinite(timestamp)
          ? formatHourMinute(timestamp)
          : "Income";

        return window.buildTooltip(tooltipProps, {
          title,
          valuePrefix: "$",
          hasTextLabel: true,
          markerExtClasses: "bg-primary",
          wrapperExtClasses: "",
        });
      },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px",
                colors: "var(--color-base-content)",
              },
              offsetX: -2,
              formatter: (value: string | number) => {
                if (value === null || value === undefined) return "";
                const timestamp = typeof value === "number" ? value : Number(value);
                if (!Number.isFinite(timestamp)) return String(value);
                return formatHourMinute(timestamp);
              },
            },
          },
          yaxis: {
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                fontSize: "10px",
                colors: "var(--color-base-content)",
              },
              formatter: (value: number) =>
                value >= 1000 ? `${value / 1000}k` : `${value}`,
            },
          },
        },
      },
    ],
  })) as ApexCharts | null;
});

watch(
  () => [props.values, props.timestamps, props.rangeMs],
  ([values, timestamps, rangeMs]) => {
    if (!chart) return;
    chart.updateOptions(
      {
        series: [{ name: "Income", data: buildSeriesData(values, timestamps) }],
        xaxis: { type: "datetime", range: rangeMs },
      },
      false,
      true
    );
  }
);

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="rounded-box bg-base-100 p-6">
    <h2 class="text-lg font-semibold text-base-content">Income</h2>
    <div id="apex-single-area-chart" class="mt-4 w-full"></div>
  </div>
</template>
