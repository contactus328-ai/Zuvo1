import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Pre-bundle these to avoid resolve issues in Vercel builds
    include: ["@supabase/supabase-js", "@supabase/auth-js"],
  },
  build: {
    // Your project builds to "build/" (matches Vercel settings)
    outDir: "build",
  },
});
