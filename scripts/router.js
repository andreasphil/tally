import { createRouter, createWebHashHistory } from "vue-router";
import { useCounters } from "./store.js";
import CounterView from "./views/CounterView.js";
import CountersView from "./views/CountersView.js";
import HomeView from "./views/HomeView.js";

export const router = createRouter({
  // Hash history: the app is served statically (GitHub Pages) with relative paths
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: () => (useCounters().counters.value.length ? { name: "counters" } : true),
    },
    { path: "/counters", name: "counters", component: CountersView },
    { path: "/counters/:id", name: "counter", component: CounterView },
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
});
