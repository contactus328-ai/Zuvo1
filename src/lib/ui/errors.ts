export function toMessage(err: unknown) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return (err as { message?: string }).message as string;
  }
  return "Something went wrong. Please try again.";
}
