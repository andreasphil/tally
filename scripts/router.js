import { createRouter, createWebHashHistory } from "vue-router";
import { useCounters } from "./store.js";
import counter from "./views/counter.js";
import counters from "./views/counters.js";
import home from "./views/home.js";

export const router = createRouter({
  // Hash history: the app is served statically (GitHub Pages) with relative paths
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
      beforeEnter: () => (useCounters().counters.value.length ? { name: "counters" } : true),
    },
    { path: "/counters", name: "counters", component: counters },
    { path: "/counters/:id", name: "counter", component: counter },
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
});
