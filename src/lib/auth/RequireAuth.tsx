import { Navigate } from "react-router-dom";

export default function RequireAuth({ user, children }: { user: any; children: JSX.Element }) {
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
