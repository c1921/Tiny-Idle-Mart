import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import _ from "lodash";
import ApexCharts from "apexcharts";
import "apexcharts/dist/apexcharts.css";
import { buildChart, buildTooltip } from "flyonui/dist/helper-apexcharts.js";
import "./style.css";
import "flyonui/flyonui";
import { Observer } from "tailwindcss-intersect";

const globalWindow = window as typeof window & {
  _: typeof _;
  ApexCharts: typeof ApexCharts;
  buildChart: typeof buildChart;
  buildTooltip: typeof buildTooltip;
};
globalWindow._ = _;
globalWindow.ApexCharts = ApexCharts;
globalWindow.buildChart = buildChart;
globalWindow.buildTooltip = buildTooltip;

Observer.start();
const app = createApp(App);
app.use(router);
app.mount("#app");
