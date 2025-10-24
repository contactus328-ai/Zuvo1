export function assertServerAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!auth || !auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  return null; // ok
}
