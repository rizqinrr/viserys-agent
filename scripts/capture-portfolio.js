// @ts-check
const { chromium, devices } = require('@playwright/test');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const TMP_DIR = '/tmp/viserys-portfolio-shots';
const DEST_DIR = '/media/rizqi/DATA/01_Coding/www/profile/public/projects/viserys-agent';

async function main() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  // 1. Start Python HTTP server
  console.log(`Starting static server on ${BASE_URL}...`);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', 'site'], {
    stdio: 'ignore',
    detached: false,
  });

  // Give server 1 second to start
  await new Promise((r) => setTimeout(r, 1000));

  console.log('Launching Brave Browser via Playwright...');
  const browser = await chromium.launch({
    executablePath: process.env.BRAVE_PATH || '/usr/bin/brave-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    // --- DESKTOP CAPTURES ---
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2, // HiDPI / Retina quality
    });
    const desktopPage = await desktopContext.newPage();
    console.log('Navigating to desktop site...');
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000); // Wait for canvas dot wave & GSAP load

    console.log('Capturing Desktop Hero / Cover...');
    await desktopPage.screenshot({
      path: path.join(TMP_DIR, 'cover.png'),
      clip: { x: 0, y: 0, width: 1440, height: 860 },
    });

    console.log('Capturing 01-hero-sonargrid...');
    await desktopPage.screenshot({
      path: path.join(TMP_DIR, '01-hero-sonargrid.png'),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    console.log('Capturing 02-architecture-bento...');
    const bentoSection = desktopPage.locator('#bento-architecture');
    await bentoSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(800);
    await bentoSection.screenshot({
      path: path.join(TMP_DIR, '02-architecture-bento.png'),
    });

    console.log('Capturing 03-interactive-workbench...');
    const workbenchSection = desktopPage.locator('#workbench');
    await workbenchSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(800);
    await workbenchSection.screenshot({
      path: path.join(TMP_DIR, '03-interactive-workbench.png'),
    });

    console.log('Capturing 04-adapters-ecosystem...');
    const adaptersSection = desktopPage.locator('#adapters');
    await adaptersSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(800);
    await adaptersSection.screenshot({
      path: path.join(TMP_DIR, '04-adapters-ecosystem.png'),
    });

    console.log('Capturing 06-full-page...');
    await desktopPage.screenshot({
      path: path.join(TMP_DIR, '06-full-page.png'),
      fullPage: true,
    });

    await desktopContext.close();

    // --- MOBILE CAPTURE ---
    console.log('Capturing 05-mobile-responsive...');
    const pixel5 = devices['Pixel 5'];
    const mobileContext = await browser.newContext({
      ...pixel5,
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1500);

    await mobilePage.screenshot({
      path: path.join(TMP_DIR, '05-mobile-responsive.png'),
    });

    await mobileContext.close();

    console.log('All PNG screenshots taken. Converting to WebP with Python Pillow...');
    const pyScript = `
import os
from PIL import Image

src_dir = "${TMP_DIR}"
dest_dir = "${DEST_DIR}"

for fname in os.listdir(src_dir):
    if fname.endswith(".png"):
        src_path = os.path.join(src_dir, fname)
        base = os.path.splitext(fname)[0]
        dest_path = os.path.join(dest_dir, f"{base}.webp")
        with Image.open(src_path) as im:
            im.save(dest_path, "WEBP", quality=90, method=6)
        print(f"Converted {fname} -> {base}.webp ({os.path.getsize(dest_path)} bytes)")
`;
    execSync(`python3 -c '${pyScript}'`, { stdio: 'inherit' });
    console.log('WebP conversion completed successfully!');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
