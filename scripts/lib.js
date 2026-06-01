import htm from "@common/htm.js";
import { computed, h, ref, toValue, watch } from "@common/vue.runtime.esm-browser.prod.js";

// Utils --------------------------------------------------

export const html = htm.bind(h);

/**
 * Simple heuristic for detecting if an app is running in development (a.k.a served from localhost)
 * or production (everything else).
 */
export function isDev() {
  return window.location.hostname === "localhost";
}

// Store --------------------------------------------------

/**
 * @typedef Counter
 * @property {string} id
 * @property {string} name
 * @property {number} count
 * @property {string} updatedAt
 */

/**
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateTime(dateStr) {
  const formatter = Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const date = Temporal.PlainDateTime.from(dateStr);
    return formatter.format(date);
  } catch {
    return "";
  }
}

function createCounterStore() {
  const counters = ref([]);

  /**
   * @param {string} name
   * @returns {string}
   */
  function create(name) {
    const id = crypto.randomUUID();

    /** @type {Counter} */
    const counter = { id, name, updatedAt: Temporal.Now.plainDateTimeISO().toString(), count: 0 };
    counters.value = [...counters.value, counter];

    return id;
  }

  /**
   * @param {string} id
   * @param {(current: number) => number} mod
   */
  function set(id, mod) {
    const index = counters.value.findIndex((i) => i.id === id);
    if (index < 0) return;

    const next = { ...counters.value[index] };
    next.count = mod(next.count);
    next.updatedAt = Temporal.Now.plainDateTimeISO();
    counters.value = counters.value.with(index, next);
  }

  /**
   * @param {string} id
   * @param {number} incrementBy
   */
  function increment(id, incrementBy = 1) {
    set(id, (c) => c + incrementBy);
  }

  /**
   * @param {string} id
   * @param {number} decrementBy
   */
  function decrement(id, decrementBy = 1) {
    set(id, (c) => c - decrementBy);
  }

  /** @param {string} id */
  function remove(id) {
    const index = counters.value.findIndex((i) => i.id === id);
    if (index < 0) return;

    counters.value = counters.value.toSpliced(index, 1);
  }

  // Persisting ---------------------------------------------

  function loadFromStorage() {
    const saved = localStorage.getItem("counters");
    if (!saved) return;

    try {
      counters.value = JSON.parse(saved);
    } catch (e) {
      console.error("failed to restore counters from localStorage", e);
    }
  }

  function saveToStorage() {
    localStorage.setItem("counters", JSON.stringify(counters.value));
  }

  watch(counters, () => saveToStorage(), { deep: true });

  loadFromStorage();

  return () => ({
    counters,
    createCounter: create,
    decrementCounter: decrement,
    incrementCounter: increment,
    removeCounter: remove,
    setCounter: set,
  });
}

export const useCounters = createCounterStore();

export function useCounter(id) {
  const { counters } = useCounters();

  return computed(() => {
    const idVal = toValue(id);
    if (!idVal) return undefined;
    return counters.value.find((i) => i.id === idVal);
  });
}
