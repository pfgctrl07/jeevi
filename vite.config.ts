import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Lets the frontend be tunneled alone (e.g. via ngrok) without also
    // tunneling the API separately — /api requests are same-origin from the
    // browser's point of view and Vite forwards them to the local backend.
    proxy: {
      "/api": "http://localhost:4000",
    },
    // Vite rejects unrecognized Host headers by default (DNS-rebinding
    // protection). ngrok's free-tier subdomain is random per restart, so
    // pin the one currently in use rather than disabling the check broadly.
    allowedHosts: ["suburb-wolf-reawake.ngrok-free.dev"],
  },
});
