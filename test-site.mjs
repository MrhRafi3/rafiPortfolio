import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/rafi/.gemini/antigravity/scratch/slick-studio/screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`PageError: ${err.message}`);
  });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 1.5 seconds for GSAP entrance and Three.js initialization
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Screenshot Hero
  console.log('Taking Hero screenshot...');
  await page.screenshot({ path: path.join(outDir, '01_hero.jpg'), type: 'jpeg', quality: 90 });

  // 2. Scroll to Studio Intro
  console.log('Scrolling to Studio Intro...');
  await page.evaluate(() => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '02_studio.jpg'), type: 'jpeg', quality: 90 });

  // 3. Scroll to What We Do
  console.log('Scrolling to What We Do...');
  await page.evaluate(() => {
    document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_what_we_do.jpg'), type: 'jpeg', quality: 90 });

  // 4. Scroll to Services Chapters
  const chapters = ['chapter-design', 'chapter-development', 'chapter-mobile', 'chapter-launch'];
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    console.log(`Scrolling to ${ch}...`);
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    }, ch);
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, `04_service_${i + 1}_${ch}.jpg`), type: 'jpeg', quality: 90 });
  }

  // 5. Scroll to Selected Work
  console.log('Scrolling to Selected Work...');
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_selected_work.jpg'), type: 'jpeg', quality: 90 });

  // 6. Scroll to Contact & Footer
  console.log('Scrolling to Contact & Footer...');
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_contact_footer.jpg'), type: 'jpeg', quality: 90 });

  // 7. Mobile Viewport (iPhone 14 Pro: 393 x 852)
  console.log('Testing Mobile Viewport...');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_mobile_hero.jpg'), type: 'jpeg', quality: 90 });

  await browser.close();

  console.log('\n--- BROWSER TEST RESULTS ---');
  console.log(`Total console logs: ${consoleLogs.length}`);
  console.log(`Total errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
  } else {
    console.log('✅ ZERO CONSOLE ERRORS! All pages loaded and rendered successfully.');
  }
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
