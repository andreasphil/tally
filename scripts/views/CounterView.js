import { computed, defineComponent, watchEffect } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { prompt } from "../../common/cap.js";
import { Check, History, Minus, Plus, SquarePen, Trash2 } from "../icons.js";
import { html } from "../lib.js";
import { formatDateTime, useCounter, useCounters } from "../store.js";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useCounters();

    const id = computed(() => /** @type {string} */ (route.params.id));
    const counter = useCounter(id);

    // Unknown or deleted counter, go back to the list
    watchEffect(() => {
      if (route.name === "counter" && !counter.value) router.replace({ name: "counters" });
    });

    async function beginSetCounter() {
      if (!counter.value) return;

      const countStr = await prompt(`Set the value of ${counter.value.name}:`);
      if (!countStr?.trim()) return;
      const newCount = Number.parseInt(countStr);
      if (Number.isFinite(newCount)) store.setCounter(counter.value.id, () => newCount);
    }

    function beginRemoveCounter() {
      if (!counter.value) return;
      store.removeCounter(counter.value.id);
    }

    return () =>
      counter.value &&
      html`
        <div class="counterDetail margin-y-body">
          <header><h1 class="font-size-h4">${counter.value.name}</h1></header>

          <div class="counter">
            <button onClick=${() => store.decrementCounter(counter.value.id)}>
              <span innerHTML=${Minus}></span>
            </button>

            <span class="count">
              <span class="font-size-h1">${counter.value.count}</span>
              <span class="clamp caps color-primary font-size-small font-weight-medium text-center">
                ${counter.value.name}
              </span>
            </span>

            <button onClick=${() => store.incrementCounter(counter.value.id)}>
              <span innerHTML=${Plus}></span>
            </button>
          </div>

          <p class="updatedAt">
            <span innerHTML=${History}></span>
            ${formatDateTime(counter.value.updatedAt)}
          </p>

          <footer>
            <button variant="muted" onClick=${() => beginSetCounter()}>
              <span innerHTML=${SquarePen}></span>
              Set
            </button>

            <button variant="muted" onClick=${() => beginRemoveCounter()}>
              <span innerHTML=${Trash2}></span>
              Delete
            </button>

            <div></div>

            <${RouterLink} to=${{ name: "counters" }} variant="secondary" role="button">
              <span innerHTML=${Check}></span>
              Done
            <//>
          </footer>
        </div>
      `;
  },
});
