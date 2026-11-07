import "temporal-polyfill/global";
import { createVaporApp, defineVaporComponent, onMounted } from "vue";
import { useRouter } from "./router";
import { Counter } from "./views/counter";
import { Counters } from "./views/counters";
import { Home } from "./views/home";

const App = defineVaporComponent(() => {
  const router = useRouter();
  router.start();

  onMounted(() => {
    router.start();
  });

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <a href="#/">Home</a>
            </li>
            <li>
              <a href="#/counters">Counters</a>
            </li>
            <li>
              <a href="#/counters/1">First Counter</a>
            </li>
          </ul>
        </nav>
      </header>

      <Home v-if={router.route.value?.name === "Home"} />
      <Counter v-else-if={router.route.value?.name === "Counter"} />
      <Counters v-else-if={router.route.value?.name === "Counters"} />
      <div v-else>Not found</div>
    </>
  );
});

createVaporApp(App).mount("#app");
