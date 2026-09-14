import { readdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const root = "src/content";
let count = 0;
for (const folder of await readdir(root, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  const en = JSON.parse(
      await readFile(`${root}/${folder.name}/en.json`, "utf8"),
    ),
    ar = JSON.parse(await readFile(`${root}/${folder.name}/ar.json`, "utf8"));
  assert.deepEqual(
    Object.keys(en).sort(),
    Object.keys(ar).sort(),
    `Locale key parity: ${folder.name}`,
  );
  for (const [locale, p] of [
    ["en", en],
    ["ar", ar],
  ]) {
    assert.ok(
      p.hero && p.title,
      `${folder.name}/${locale} requires hero and title`,
    );
    for (const block of p.blocks) {
      assert.deepEqual(Object.keys(block).sort(), ["items", "kind", "text"]);
      assert.ok(
        ["heading", "text", "list", "cta", "message", "trust"].includes(
          block.kind,
        ),
      );
      assert.ok(Array.isArray(block.items));
    }
    assert.ok(
      !JSON.stringify(p).includes("\u2014"),
      "Public copy cannot contain em dashes",
    );
  }
  count++;
}
assert.equal(count, 17);
console.log(
  "17 paired page namespaces pass key and content structure checks. See docs/needs-human-verification.md for editorial gaps; key parity is not translation completeness.",
);
