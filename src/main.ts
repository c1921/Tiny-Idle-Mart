import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "flyonui/flyonui";
import { Observer } from "tailwindcss-intersect";

Observer.start();
const app = createApp(App);
app.use(router);
app.mount("#app");
