import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { demoNode } from "./server/node-adapter.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "demo-endpoint",
      configureServer(server) {
        server.middlewares.use("/api/demo", (req, res) => {
          void demoNode(req, res);
        });
      },
    },
  ],
  build: { chunkSizeWarningLimit: 600 },
});
