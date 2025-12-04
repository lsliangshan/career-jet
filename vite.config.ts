import path from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import tailwindcss from "@tailwindcss/postcss";

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin({
      rem2rpx: true,
      disabled: WeappTailwindcssDisabled,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@static": path.resolve(__dirname, "src/static"),
      "@config": path.resolve(__dirname, "src/config"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },

  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
