import { defineVaporComponent } from "vue";
import { Blocks } from "../icons";

export const Home = defineVaporComponent(() => {
  return (
    <hgroup class="text-center">
      <img class="rounded-squircle shadow-high" src="./icon-192.png" width="72" height="72" />
      <h1>Tally</h1>
      <p>A simple app for counting things</p>

      <p class="margin-y-outer-spacing">
        <a href="/#/counters" role="button" variant="haptic">
          <span v-html={Blocks}></span>
          Get started
        </a>
      </p>
    </hgroup>
  );
});
