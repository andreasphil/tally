import "temporal-polyfill/global";
import { createApp, defineComponent } from "vue";
import { html } from "./lib.js";
import { router } from "./router.js";

const App = defineComponent({
  name: "App",

  template: html`<RouterView />`,
});

createApp(App).use(router).mount("#app");
