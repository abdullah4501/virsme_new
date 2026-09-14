import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
const original = await readFile("public/brand/logo.png");
await sharp(original)
  .png({ compressionLevel: 9 })
  .toFile("public/brand/logo-2x.png");
await sharp(original)
  .resize({ width: 307 })
  .png()
  .toFile("public/brand/logo-1x.png");
const { data, info } = await sharp(original)
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += info.channels) {
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
}
await sharp(data, { raw: info }).png().toFile("public/brand/logo-white.png");
const icon = await sharp(original)
  .extract({ left: 39, top: 17, width: 110, height: 127 })
  .png()
  .toBuffer();
await writeFile("public/brand/icon.png", icon);
for (const size of [16, 32, 180, 512])
  await sharp(icon)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(`public/brand/favicon-${size}.png`);
console.log(
  "Approved logo geometry retained; white monochrome follows Appendix A.",
);
