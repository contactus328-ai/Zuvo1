import { createRoot } from "react-dom/client";
import type { User } from "@supabase/supabase-js";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./lib/ErrorBoundary";
import {
  getSession,
  refreshSession,
  onAuthStateChange,
} from "./lib/auth/session";

declare global {
  interface Window {
    __authUser?: User | null;
  }
}

(async function boot() {
  await refreshSession();
  const { user } = getSession();
  window.__authUser = user ?? null;
  onAuthStateChange((session) => {
    window.__authUser = session?.user ?? null;
  });
})();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
