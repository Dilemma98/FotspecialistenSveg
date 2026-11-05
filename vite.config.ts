
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://fotspecialisten-api.emma-hogdal.workers.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
