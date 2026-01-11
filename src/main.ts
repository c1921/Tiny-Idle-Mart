import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "flyonui/flyonui";
import { Observer } from "tailwindcss-intersect";

Observer.start();
createApp(App).mount("#app");
