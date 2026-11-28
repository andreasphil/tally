import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { prompt } from "../../common/cap.js";
import { Blocks } from "../icons.js";
import { html } from "../lib.js";
import { useCounters } from "../store.js";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useCounters();

    async function beginCreateCounter() {
      const name = await prompt("Name:");
      if (!name?.trim()) return;
      store.createCounter(name);
      router.push({ name: "counters" });
    }

    return () => html`
      <hgroup class="text-center margin-y-body" style="--outer-spacing-y: 2rem;">
        <img class="rounded-squircle shadow-high" src="./icon-192.png" width="72" height="72" />
        <h1>Tally</h1>
        <p>A simple app for counting things.</p>
        <p class="margin-y-outer-spacing">
          <button variant="haptic" onClick=${() => beginCreateCounter()}>
            <span innerHTML=${Blocks}></span>
            Add counter
          </button>
        </p>
      </hgroup>
    `;
  },
});
