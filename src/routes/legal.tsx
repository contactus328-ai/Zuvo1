import { createBrowserRouter } from "react-router-dom";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
export const legalRoutes = [
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <Terms /> },
];
export const router = createBrowserRouter(legalRoutes);
