import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split third-party code into long-lived vendor chunks so repeat visits
    // reuse the cached React/UI/state bundles instead of re-downloading them.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@radix-ui") || id.includes("lucide-react"))
            return "vendor-ui";
          if (
            id.includes("redux") ||
            id.includes("immer") ||
            id.includes("reselect")
          )
            return "vendor-state";
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router") ||
            id.includes("scheduler") ||
            id.includes("axios")
          )
            return "vendor-core";
          return "vendor";
        },
      },
    },
  },
})


// import path from "path";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000',
//     },
//   },
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });
