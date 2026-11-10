import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser for comprehensive verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle'],
  });

  const page = await browser.newPage();
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

  // 1. Desktop 1440x900
  console.log('Navigating to http://127.0.0.1:5173/ at 1440x900...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 1.8 seconds for preloader & GSAP entrance sequence
  await new Promise((r) => setTimeout(r, 1800));

  console.log('1. Capturing Hero Section...');
  await page.screenshot({ path: path.join(outDir, '01_hero_mrh_rafi.jpg'), type: 'jpeg', quality: 90 });

  console.log('2. Scrolling to About Me...');
  await page.evaluate(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '02_about_me.jpg'), type: 'jpeg', quality: 90 });

  console.log('3. Scrolling to Technical Skills...');
  await page.evaluate(() => {
    document.getElementById('skills')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_skills.jpg'), type: 'jpeg', quality: 90 });

  console.log('4. Scrolling to Horizontal Project Showcase...');
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_project_showcase.jpg'), type: 'jpeg', quality: 90 });

  console.log('5. Testing Project Detail Modal (Clicking Project 01 Clocky)...');
  const openedModal = await page.evaluate(() => {
    const btn = document.querySelector('button[data-test="explore-clocky"]') || document.querySelector('#work button');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_project_modal_clocky.jpg'), type: 'jpeg', quality: 90 });

  console.log('Pressing Escape to close modal...');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));

  console.log('6. Scrolling to Developer Workflow (How I Build)...');
  await page.evaluate(() => {
    document.getElementById('process')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_workflow.jpg'), type: 'jpeg', quality: 90 });

  console.log('7. Scrolling to Technical Deep Dive...');
  await page.evaluate(() => {
    document.getElementById('deep-dive')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_technical_deep_dive.jpg'), type: 'jpeg', quality: 90 });

  console.log('8. Scrolling to Interactive 3D Phone Lab...');
  await page.evaluate(() => {
    document.getElementById('interactive-3d')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '08_3d_phone_lab.jpg'), type: 'jpeg', quality: 90 });

  console.log('9. Scrolling to Contact & Footer...');
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '09_contact_footer.jpg'), type: 'jpeg', quality: 90 });

  // 10. Tablet (768x1024)
  console.log('10. Testing Tablet Viewport (768x1024)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '10_tablet_hero.jpg'), type: 'jpeg', quality: 90 });

  // 11. Mobile (390x844 iPhone 14)
  console.log('11. Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '11_mobile_hero.jpg'), type: 'jpeg', quality: 90 });

  console.log('12. Testing Mobile Project Gallery...');
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '12_mobile_projects.jpg'), type: 'jpeg', quality: 90 });

  console.log('13. Testing Mobile Menu Drawer Toggle...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    const hamburger = document.querySelector('button[aria-label="Open menu"]') || document.querySelector('header button.lg\\:hidden');
    hamburger?.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '13_mobile_menu_open.jpg'), type: 'jpeg', quality: 90 });

  // 14. Small Mobile (360x740)
  console.log('14. Testing Small Mobile Viewport (360x740)...');
  await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '14_small_mobile_hero.jpg'), type: 'jpeg', quality: 90 });

  await browser.close();

  console.log('\n--- BROWSER VERIFICATION REPORT ---');
  console.log(`Total console logs: ${consoleLogs.length}`);
  console.log(`Total console/page errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors encountered:');
    errors.forEach((e) => console.error('  ❌', e));
    process.exit(1);
  } else {
    console.log('✅ 100% CLEAN! ZERO CONSOLE ERRORS & ZERO PAGE ERRORS!');
  }
}

run().catch((err) => {
  console.error('Verification script failed:', err);
  process.exit(1);
});
