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
    target: "chrome58",
    //minify: "terser",
    //minify: false,
    emptyOutDir: true,
    modulePreload: true,
    rollupOptions: {
      input: "index.html",
      external: [
      ],
      plugins: [
      ],
      output: {
        manualChunks(id) {
          if (id.includes("/igpt-ui/node_modules/")) {
            var vvv = id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
            if (vvv.startsWith("element-plus") || vvv.startsWith("@element-plus")) {
              return "element";
            } else if (vvv.startsWith("vant") || vvv.startsWith("@vant")) {
              return "vant";
            } else {
              return "vendor";
            }
          }
          if (id.includes("/igpt-ui/src/")) {
            return "app";
          }
        },
      },
    },
  },
});
