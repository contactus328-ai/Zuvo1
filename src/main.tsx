import "./consoleHelpers";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./lib/ErrorBoundary";
import { getSession, onAuthStateChange } from "./lib/auth/session";

(async function boot() {
  const { user } = await getSession();
  (window as any).__authUser = user;
  onAuthStateChange((session) => ((window as any).__authUser = session?.user ?? null));
})();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

