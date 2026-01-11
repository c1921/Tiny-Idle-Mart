import { createRouter, createWebHashHistory } from "vue-router";
import PopupView from "../views/Popup.vue";

const EmptyView = {
  render: () => null,
};

const routes = [
  {
    path: "/",
    name: "main",
    component: EmptyView,
  },
  {
    path: "/popup",
    name: "popup",
    component: PopupView,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
