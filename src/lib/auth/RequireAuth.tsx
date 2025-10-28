import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../session";

type Props = { children: ReactNode };
export default function RequireAuth({ children }: Props) {
  const nav = useNavigate();
  useEffect(() => {
    const session = getSession();
    if (!session?.user) nav("/signin", { replace: true });
  }, [nav]);
  return <>{children}</>;
}
