import { ref } from "vue";

/**
 * @typedef RouteDef
 * @property {string} name
 * @property {string} path
 */

/**
 * @typedef ResolvedRoute
 * @property {string} name
 * @property {string} input
 * @property {Record<string, string | undefined>} params
 */

/**
 * @template {RouteDef[]} T
 * @param {T} routes
 */
export function createRouter(routes) {
  const compiled = routes.map((route) => ({
    ...route,
    pattern: new URLPattern({ hash: route.path }),
  }));

  /** @type {import("vue").Ref<ResolvedRoute | undefined>} */
  const route = ref();

  function resolve(dest = window.location.href) {
    /** @type {URLPatternResult | null} */
    let match = null;

    /** @type {RouteDef | null} */
    let matchedRoute = null;

    let i = 0;

    while (!match && i < compiled.length) {
      match = compiled[i].pattern.exec(dest);
      if (match) matchedRoute = compiled[i];
      i++;
    }

    if (!(matchedRoute && match)) {
      console.warn(`destination ${dest} did not resolve to a known route`);
      return;
    }

    console.info(`resolved ${dest} to route ${matchedRoute.name}`);

    route.value = {
      name: matchedRoute.name,
      input: match.hash.input,
      params: match.hash.groups,
    };
  }

  function listenOnNavigation() {
    navigation.addEventListener("navigate", (event) => {
      if (!event.hashChange) return;
      const dest = event.destination.url;
      resolve(dest);
    });
  }

  function start() {
    listenOnNavigation();
    resolve();
  }

  return { start, route };
}

const router = createRouter([
  { name: "Home", path: "#/" },
  { name: "Counters", path: "#/counters" },
  { name: "Counter", path: "#/counters/:id" },
]);

// Instance
export function useRouter() {
  return router;
}
