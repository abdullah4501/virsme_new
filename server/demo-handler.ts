import { demoSchema } from "../shared/demo-schema.ts";
export type DemoEnvironment = {
  DEMO_DELIVERY_URL?: string;
  DEMO_DELIVERY_TOKEN?: string;
  SITE_ORIGIN?: string;
  NODE_ENV?: string;
};
export async function handleDemo(
  request: Request,
  env: DemoEnvironment,
  deliver: typeof fetch = fetch,
): Promise<Response> {
  const origin = request.headers.get("origin");
  const allowed = env.SITE_ORIGIN || new URL(request.url).origin;
  const cors =
    origin === allowed
      ? { "Access-Control-Allow-Origin": allowed, Vary: "Origin" }
      : {};
  const reply = (body: Record<string, unknown>, status: number) =>
    Response.json(body, {
      status,
      headers: { "Cache-Control": "no-store", ...cors },
    });
  if (origin && origin !== allowed)
    return reply({ ok: false, error: "origin" }, 403);
  if (request.method === "OPTIONS")
    return new Response(null, {
      status: 204,
      headers: {
        ...cors,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  if (request.method !== "POST")
    return reply({ ok: false, error: "method" }, 405);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ ok: false, error: "content_type" }, 415);
  const reader = request.body?.getReader();
  if (!reader) return reply({ ok: false, error: "body" }, 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16000) {
      await reader.cancel();
      return reply({ ok: false, error: "body_too_large" }, 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return reply({ ok: false, error: "json" }, 400);
  }
  const parsed = demoSchema.safeParse(body);
  if (!parsed.success)
    return reply(
      {
        ok: false,
        error: "validation",
        fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))],
      },
      422,
    );
  const { website, startedAt, ...submission } = parsed.data,
    elapsed = Date.now() - startedAt;
  if (website || elapsed < 2000 || elapsed > 86400000)
    return reply({ ok: false, error: "spam" }, 429);
  if (!env.DEMO_DELIVERY_URL) {
    if (env.NODE_ENV !== "production")
      console.error(
        "[VirSME demo] Configure DEMO_DELIVERY_URL before accepting submissions. No submission was delivered.",
      );
    return reply({ ok: false, error: "unavailable" }, 503);
  }
  try {
    const target = new URL(env.DEMO_DELIVERY_URL);
    if (
      target.protocol !== "https:" &&
      !(
        env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1"].includes(target.hostname)
      )
    )
      throw new Error("Invalid delivery configuration");
    const response = await deliver(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.DEMO_DELIVERY_TOKEN
          ? { Authorization: `Bearer ${env.DEMO_DELIVERY_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ type: "workflow_demo", ...submission }),
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    if (!response.ok) return reply({ ok: false, error: "delivery" }, 502);
    return reply({ ok: true }, 200);
  } catch {
    return reply({ ok: false, error: "delivery" }, 502);
  }
}
