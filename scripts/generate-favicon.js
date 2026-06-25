/**
 * Writes a minimal 16x16 ICO (DIGG blue #152232) to public/favicon.ico.
 * Run once: node scripts/generate-favicon.js
 */
const fs = require('fs');
const path = require('path');

// DIGG brand: terracotta field, coral signature dot
const TERRA_R = 0x44, TERRA_G = 0x62, TERRA_B = 0xB5;
const CORAL_R = 0x4D, CORAL_G = 0x62, CORAL_B = 0xE8;
const W = 16, H = 16;
const bmpHeaderLen = 40;
const imgSize = W * H * 4;
const maskSize = Math.ceil((W * H) / 8);
const bmpSize = bmpHeaderLen + imgSize + maskSize;

// ICO file: ICONDIR (6) + ICONDIRENTRY (16) + bitmap
const dir = Buffer.alloc(6);
dir[2] = 1; dir[4] = 1; // type 1, count 1

const entry = Buffer.alloc(16);
entry[0] = W; entry[1] = H;
entry[4] = 1; entry[5] = 32; // planes, bit count
entry.writeUInt32LE(bmpSize, 8);
entry.writeUInt32LE(22, 12); // offset to bitmap

const bmp = Buffer.alloc(bmpSize);
let o = 0;
// BITMAPINFOHEADER
bmp.writeUInt32LE(bmpHeaderLen, o); o += 4;
bmp.writeInt32LE(W, o); o += 4;
bmp.writeInt32LE(H * 2, o); o += 4; // height * 2 for image + mask
bmp.writeUInt16LE(1, o); o += 2;
bmp.writeUInt16LE(32, o); o += 2;
bmp.writeUInt32LE(0, o); o += 4;
bmp.writeUInt32LE(imgSize, o); o += 4;
for (let i = 0; i < 4; i++) bmp.writeUInt32LE(0, o); o += 16;
// Pixel data (bottom-up, BGRA) — terracotta background
for (let y = H - 1; y >= 0; y--) {
  for (let x = 0; x < W; x++) {
    bmp[o++] = TERRA_B; bmp[o++] = TERRA_G; bmp[o++] = TERRA_R; bmp[o++] = 255;
  }
}
// Coral signature dot (bottom-right area)
for (let y = 3; y <= 6; y++) {
  for (let x = 10; x <= 13; x++) {
    const row = (H - 1 - y) * W + x;
    const px = bmpHeaderLen + row * 4;
    bmp[px] = CORAL_B; bmp[px + 1] = CORAL_G; bmp[px + 2] = CORAL_R; bmp[px + 3] = 255;
  }
}
// AND mask (all 0 = no transparency)
bmp.fill(0, o);

const ico = Buffer.concat([dir, entry, bmp]);
const out = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ico);
console.log('Wrote', out, ico.length, 'bytes');