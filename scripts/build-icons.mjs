import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

/*
  Renders the PNG and ICO icons from src/app/icon.svg, which is the one to
  edit. if i ever change it again, run it after changing the SVG: node scripts/build-icons.mjs */
const app = new URL("../src/app/", import.meta.url);
const svg = await readFile(new URL("icon.svg", app));

function png(size) {
  return sharp(svg, { density: (72 * size) / 64 })
    .resize(size, size)
    .png()
    .toBuffer();
}

function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 means icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(size, entry); // width
    header.writeUInt8(size, entry + 1); // height
    header.writeUInt8(0, entry + 2); // no palette
    header.writeUInt8(0, entry + 3); // reserved
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

// for ancient browsers
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map(async (size) => ({ size, data: await png(size) })),
);
await writeFile(new URL("favicon.ico", app), ico(images));

const apple = await sharp({
  create: { width: 180, height: 180, channels: 4, background: "#faf8f3" },
})
  .composite([{ input: await png(128), gravity: "center" }])
  .png()
  .toBuffer();
await writeFile(new URL("apple-icon.png", app), apple);

console.log("Wrote src/app/favicon.ico and src/app/apple-icon.png");
