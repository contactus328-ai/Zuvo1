import { useState } from "react";
import { signInSchema } from "../../lib/validation";

export default function SignInForm({
  onSubmit,
}: {
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const parse = signInSchema.safeParse({ email });
    if (!parse.success) {
      setErr(parse.error.issues.map((issue) => issue.message).join(", "));
      return;
    }
    setErr(null);
    onSubmit(email);
  };

  return (
    <form onSubmit={handle} noValidate>
      <label className="sr-only" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      {err && <p role="alert">{err}</p>}
      <button type="submit">Sign in</button>
    </form>
  );
}
