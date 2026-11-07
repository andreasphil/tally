import { defineVaporComponent } from "vue";
import { useRouter } from "../router";

export const Counter = defineVaporComponent(() => {
  const { route } = useRouter();

  return <h1>Hello counter with ID {route.value?.params.id}</h1>;
});
