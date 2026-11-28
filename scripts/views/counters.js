import { defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { prompt } from "../../common/cap.js";
import { Blocks } from "../icons.js";
import { html } from "../lib.js";
import { useCounters } from "../store.js";

export default defineComponent({
  name: "Counters",

  setup() {
    const router = useRouter();
    const store = useCounters();

    watchEffect(() => {
      if (!store.counters.value.length) router.replace({ name: "home" });
    });

    async function beginCreateCounter() {
      const name = await prompt("Name:");
      if (!name?.trim()) return;
      store.createCounter(name);
    }

    return { counters: store.counters, beginCreateCounter, Blocks };
  },

  template: html`
    <div class="counters">
      <ul class="list-none">
        <li v-for="i in counters" :key="i.id">
          <RouterLink class="item" :to="{ name: 'counter', params: { id: i.id } }">
            <span class="count">{{ i.count }}</span>
            <footer class="clamp">{{ i.name }}</footer>
          </RouterLink>
        </li>

        <li>
          <button variant="muted" @click="beginCreateCounter()">
            <span v-html="Blocks"></span>
            Add counter
          </button>
        </li>
      </ul>
    </div>
  `,
});
