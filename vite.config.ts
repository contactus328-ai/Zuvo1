import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "vite-plugin-visualizer";

// Runtime nonce injection for CSP: generates a per-build nonce and injects to index.html.
function cspNoncePlugin(): Plugin {
  return {
    name: "csp-nonce",
    transformIndexHtml(html) {
      const nonce =
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      return html
        .replace(/<script /g, `<script nonce="${nonce}" `)
        .replace(/<link /g, `<link nonce="${nonce}" `)
        .replace(
          "</head>",
          `<meta name="csp-nonce" content="${nonce}"></head>`,
        );
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    cspNoncePlugin(),
    mode === "analyze" &&
      visualizer({ filename: "dist/stats.html", gzipSize: true }),
  ].filter(Boolean),
  build: {
    sourcemap: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
}));
