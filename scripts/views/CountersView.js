import { defineComponent, watchEffect } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { prompt } from "../../common/cap.js";
import { Blocks } from "../icons.js";
import { html } from "../lib.js";
import { useCounters } from "../store.js";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useCounters();

    // Nothing to list without counters, fall back to the welcome screen
    watchEffect(() => {
      if (!store.counters.value.length) router.replace({ name: "home" });
    });

    async function beginCreateCounter() {
      const name = await prompt("Name:");
      if (!name?.trim()) return;
      store.createCounter(name);
    }

    return () => html`
      <div class="counters">
        <ul class="list-none">
          ${store.counters.value.map(
            (i) => html`
              <li key=${i.id}>
                <${RouterLink} class="counter" to=${{ name: "counter", params: { id: i.id } }}>
                  <span class="count">${i.count}</span>
                  <footer class="clamp">${i.name}</footer>
                <//>
              </li>
            `,
          )}

          <li>
            <button variant="muted" onClick=${() => beginCreateCounter()}>
              <span innerHTML=${Blocks}></span>
              Add counter
            </button>
          </li>
        </ul>
      </div>
    `;
  },
});
