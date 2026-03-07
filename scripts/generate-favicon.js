/**
 * Writes a minimal 16x16 ICO (DIGG blue #1B2A6B) to public/favicon.ico.
 * Run once: node scripts/generate-favicon.js
 */
const fs = require('fs');
const path = require('path');

// DIGG brand blue
const B = 0x6B, G = 0x2A, R = 0x1B; // little-endian order in BMP
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
// Pixel data (bottom-up, BGRA)
for (let y = H - 1; y >= 0; y--) {
  for (let x = 0; x < W; x++) {
    bmp[o++] = B; bmp[o++] = G; bmp[o++] = R; bmp[o++] = 255;
  }
}
// AND mask (all 0 = no transparency)
bmp.fill(0, o);

const ico = Buffer.concat([dir, entry, bmp]);
const out = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ico);
console.log('Wrote', out, ico.length, 'bytes');