import htm from "htm";
import { h } from "vue";

// Utils --------------------------------------------------

export const html = htm.bind(h);

/**
 * Simple heuristic for detecting if an app is running in development (a.k.a served from localhost)
 * or production (everything else).
 */
export function isDev() {
  return window.location.hostname === "localhost";
}
