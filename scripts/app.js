import "temporal-polyfill/global";
import { createApp, defineComponent, ref } from "vue";
import { prompt } from "../common/cap.js";
import { Blocks, Check, History, Minus, Plus, SquarePen, Trash2 } from "./icons.js";
import { html } from "./lib.js";
import { formatDateTime, useCounter, useCounters } from "./store.js";

const App = defineComponent({
  setup() {
    const selectedId = ref();
    const store = useCounters();
    const counter = useCounter(selectedId);

    const dialogEl = ref();

    async function beginCreateCounter() {
      const name = await prompt("Name:");
      if (!name?.trim()) return;
      store.createCounter(name);
    }

    async function selectCounter(value) {
      selectedId.value = value;
    }

    async function beginSetCounter() {
      if (!counter.value) return;

      const countStr = await prompt(`Set the value of ${counter.value.name}:`);
      if (!countStr?.trim()) return;
      const newCount = Number.parseInt(countStr);
      if (Number.isFinite(newCount)) store.setCounter(counter.value.id, () => newCount);
    }

    function beginRemoveCounter() {
      if (!selectedId.value) return;
      store.removeCounter(selectedId.value);
      dialogEl.value?.close();
      selectedId.value = undefined;
    }

    return () =>
      store.counters.value.length
        ? html`
            <div class="counters">
              <ul class="list-none">
                ${store.counters.value.map(
                  (i) => html`
                    <li key=${i.id}>
                      <button
                        class="counter"
                        commandfor="counter-dialog"
                        command="show-modal"
                        onClick=${() => selectCounter(i.id)}
                      >
                        <span class="count">${i.count}</span>
                        <footer class="clamp">${i.name}</footer>
                      </button>
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

            <dialog class="counterDetail margin-y-body" id="counter-dialog" ref=${dialogEl}>
              ${counter.value &&
              html`
                <header>${counter.value.name}</header>

                <div class="counter">
                  <button onClick=${() => store.decrementCounter(counter.value.id)}>
                    <span innerHTML=${Minus}></span>
                  </button>

                  <span class="count">
                    <span class="font-size-h1">${counter.value.count}</span>
                    <span
                      class="clamp caps color-primary font-size-small font-weight-medium text-center"
                    >
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

                  <button variant="secondary" commandfor="counter-dialog" command="close">
                    <span innerHTML=${Check}></span>
                    Done
                  </button>
                </footer>
              `}
            </dialog>
          `
        : html`
            <hgroup class="text-center margin-y-body" style="--outer-spacing-y: 2rem;">
              <img
                class="rounded-squircle shadow-high"
                src="./icon-192.png"
                width="72"
                height="72"
              />
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

createApp(App).mount("#app");
