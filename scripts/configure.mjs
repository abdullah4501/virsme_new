import { readFile, writeFile } from "node:fs/promises";
let s = await readFile("src/components/DemoForm.tsx", "utf8");
s = s.replace(
  "track('demo_form_start',{locale})}}><h2>",
  "track('demo_form_start',{locale})}}}><h2>",
);
await writeFile("src/components/DemoForm.tsx", s);
const p = JSON.parse(await readFile("package.json", "utf8"));
Object.assign(p.scripts, {
  build:
    "npm run check:content && tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs",
  typecheck: "tsc -b",
  preview: "tsx server/index.ts",
  start: "tsx server/index.ts",
  "check:content": "node scripts/check-content.mjs",
  format:
    "prettier --write src server shared scripts tests *.json *.ts *.js *.html",
  test: "tsx --test tests/server.test.ts",
  "test:browser": "playwright test",
});
await writeFile("package.json", JSON.stringify(p, null, 2) + "\n");
const r = JSON.parse(await readFile("src/content/resources/en.json", "utf8"));
r.intro = "";
await writeFile(
  "src/content/resources/en.json",
  JSON.stringify(r, null, 2) + "\n",
);
