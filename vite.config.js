import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.runtime.esm-browser.prod.js",
    },
  },
});
