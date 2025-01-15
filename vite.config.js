import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
  },
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "dist",
    //outDir: "/Users/lanren/Documents/igpt/v1.0.0",
    target: "chrome58",
    //minify: "terser",
    //minify: false,
    emptyOutDir: true,
    modulePreload: true,
    rollupOptions: {
      input: "index.html",
      external: [
        //   "vue",
        //   "element-plus",
        //   "vue-router",
        //   "moment",
        //   "LYSDK"
      ],
      plugins: [
        //   externalGlobals({
        //     vue: "Vue",
        //     "vue-router": "VueRouter",
        //     "element-plus": "ElementPlus",
        //     moment: "moment"
        //   }),
      ],
      output: {
        manualChunks(id) {
          if (id.includes("/front/node_modules/")) {
            var vvv = id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
            if (
              vvv.startsWith("element-plus") ||
              vvv.startsWith("@element-plus")
            ) {
              return "element";
            } else {
              return "vendor";
            }
          }
          if (id.includes("/front/src/")) {
            return "app";
          }
        },
      },
    },
  },
});
