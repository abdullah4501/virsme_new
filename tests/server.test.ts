import { test } from "node:test";
import assert from "node:assert/strict";
import { handleDemo } from "../server/demo-handler.ts";
const data = {
  name: "QA Example",
  company: "Local Test Fixture",
  email: "qa@example.test",
  phone: "",
  country: "Test",
  employees: "11-50",
  workflow: "Employee onboarding",
  tools: "",
  language: "en",
  meetingTime: "",
  website: "",
  startedAt: Date.now() - 5000,
};
const request = (body: unknown, origin = "https://site.example") =>
  new Request("https://site.example/api/demo", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
const env = {
  DEMO_DELIVERY_URL: "https://delivery.example/webhook",
  NODE_ENV: "production",
};
test("delivers valid bilingual submissions, excluding spam fields", async () => {
  for (const language of ["en", "ar"]) {
    let delivered: Record<string, unknown> = {};
    const fake: typeof fetch = async (_url, init) => {
      delivered = JSON.parse(String(init?.body));
      return new Response("", { status: 200 });
    };
    const r = await handleDemo(request({ ...data, language }), env, fake);
    assert.equal(r.status, 200);
    assert.equal(((await r.json()) as {ok:boolean}).ok, true);
    assert.equal(delivered.language, language);
    assert.equal(delivered.startedAt, undefined);
    assert.equal(delivered.website, undefined);
  }
});
test("rejects invalid email and missing required content before delivery", async () => {
  let calls = 0;
  const fake: typeof fetch = async () => {
    calls++;
    return new Response();
  };
  const r = await handleDemo(
    request({ ...data, email: "invalid", workflow: "" }),
    env,
    fake,
  );
  assert.equal(r.status, 422);
  assert.equal(calls, 0);
});
test("honeypot, too-fast, future and expired submissions fail", async () => {
  for (const extra of [
    { website: "spam" },
    { startedAt: Date.now() },
    { startedAt: Date.now() + 10000 },
    { startedAt: Date.now() - 90000000 },
  ])
    assert.equal(
      (await handleDemo(request({ ...data, ...extra }), env)).status,
      429,
    );
});
test("missing delivery configuration never reports success", async () => {
  const r = await handleDemo(request(data), { NODE_ENV: "production" });
  assert.equal(r.status, 503);
  assert.equal(((await r.json()) as {ok:boolean}).ok, false);
});
test("upstream failure and exceptions never report success", async () => {
  for (const fake of [
    async () => new Response("", { status: 500 }),
    async () => {
      throw new Error("timeout");
    },
  ]) {
    const r = await handleDemo(request(data), env, fake);
    assert.equal(r.status, 502);
  }
});
test("rejects oversized payload and unrelated origin", async () => {
  assert.equal(
    (await handleDemo(request({ ...data, tools: "x".repeat(20000) }), env))
      .status,
    413,
  );
  assert.equal(
    (await handleDemo(request(data, "https://other.example"), env)).status,
    403,
  );
});
test("rejects invalid JSON, content type and method", async () => {
  assert.equal(
    (await handleDemo(new Request("https://site.example/api/demo"), env))
      .status,
    405,
  );
  assert.equal(
    (
      await handleDemo(
        new Request("https://site.example/api/demo", {
          method: "POST",
          body: "bad",
        }),
        env,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleDemo(
        new Request("https://site.example/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "bad",
        }),
        env,
      )
    ).status,
    400,
  );
});
