import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { prompt } from "../../common/cap.js";
import { Check, History, Minus, Plus, SquarePen, Trash2 } from "../icons.js";
import { html } from "../lib.js";
import { formatDateTime, useCounter, useCounters } from "../store.js";

export default defineComponent({
  name: "Counter",

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

    function increment() {
      if (counter.value) store.incrementCounter(counter.value.id);
    }

    function decrement() {
      if (counter.value) store.decrementCounter(counter.value.id);
    }

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

    return {
      counter,
      increment,
      decrement,
      beginSetCounter,
      beginRemoveCounter,
      formatDateTime,
      Check,
      History,
      Minus,
      Plus,
      SquarePen,
      Trash2,
    };
  },

  template: html`
    <div v-if="counter" class="counter margin-y-body">
      <header><h1 class="font-size-h4">{{ counter.name }}</h1></header>

      <div class="controls">
        <button @click="decrement()">
          <span v-html="Minus"></span>
        </button>

        <span class="count">
          <span class="font-size-h1">{{ counter.count }}</span>
          <span class="clamp caps color-primary font-size-small font-weight-medium text-center">
            {{ counter.name }}
          </span>
        </span>

        <button @click="increment()">
          <span v-html="Plus"></span>
        </button>
      </div>

      <p class="updated-at">
        <span v-html="History"></span>
        {{ formatDateTime(counter.updatedAt) }}
      </p>

      <footer>
        <button variant="muted" @click="beginSetCounter()">
          <span v-html="SquarePen"></span>
          Set
        </button>

        <button variant="muted" @click="beginRemoveCounter()">
          <span v-html="Trash2"></span>
          Delete
        </button>

        <div></div>

        <RouterLink :to="{ name: 'counters' }" variant="secondary" role="button">
          <span v-html="Check"></span>
          Done
        </RouterLink>
      </footer>
    </div>
  `,
});
