import "temporal-polyfill/global";
import { createApp, defineComponent } from "vue";
import { RouterView } from "vue-router";
import { html } from "./lib.js";
import { router } from "./router.js";

const App = defineComponent({
  setup() {
    return () => html`<${RouterView} />`;
  },
});

createApp(App).use(router).mount("#app");
