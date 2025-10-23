import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "vite-plugin-visualizer";

const FIGMA_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P34f/gAAAABJRU5ErkJggg==";

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

function figmaAssetPlugin(): Plugin {
  return {
    name: "figma-asset",
    enforce: "pre",
    resolveId(source) {
      if (source.startsWith("figma:asset/")) {
        return source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith("figma:asset/")) {
        return `export default "${FIGMA_PLACEHOLDER}";`;
      }
      return null;
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssetPlugin(),
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
