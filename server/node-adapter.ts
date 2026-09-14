import type { IncomingMessage, ServerResponse } from "node:http";
import { handleDemo } from "./demo-handler.ts";
import type {DemoEnvironment} from './demo-handler.ts';
export async function demoNode(req: IncomingMessage, res: ServerResponse, env:DemoEnvironment=process.env) {
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16000) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "body_too_large" }));
        return;
      }
      chunks.push(chunk);
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers))
      if (value)
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
    const response = await handleDemo(
      new Request(`http://${req.headers.host || "localhost"}${req.url}`, {
        method: req.method,
        headers,
        ...(["POST", "PUT", "PATCH"].includes(req.method || "")
          ? { body: Buffer.concat(chunks) }
          : {}),
      }),
      env,
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "request" }));
  }
}
