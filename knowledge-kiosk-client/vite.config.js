import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Knowledge Kiosk 2025",
        short_name: "KK2025",
        description: "An example PWA",
        start_url: "http://localhost:5173/",
        display: "fullscreen",
        background_color: "#ffffff",
        theme_color: "#3b82f6",
        icons: [
          { src: "/icons/kiosk-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/kiosk-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
