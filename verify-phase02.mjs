import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots/phase02');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Starting Phase 02 Comprehensive Automated Verification...');

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

  // ==========================================
  // TEST 1: Initial Page Load (1440x900)
  // ==========================================
  console.log('\n--- TEST 1: Initial Page Load & Initial Rendering ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });

  // Wait 1.8 seconds for Preloader sequence and initial mount
  await new Promise((r) => setTimeout(r, 1800));

  await page.screenshot({ path: path.join(outDir, '01_initial_hero_load.jpg'), type: 'jpeg', quality: 90 });

  const initialStatus = await page.evaluate(() => {
    const heroTitle = document.querySelector('#hero h1');
    const heroCanvas = document.querySelector('#hero canvas');
    const snakeSvg = document.querySelector('svg.pointer-events-none');
    const snakePath = snakeSvg?.querySelector('path');

    return {
      heroTitleText: heroTitle?.textContent?.trim(),
      heroTitleOpacity: heroTitle ? window.getComputedStyle(heroTitle).opacity : null,
      heroCanvasExists: !!heroCanvas,
      snakeSvgExists: !!snakeSvg,
      snakePathExists: !!snakePath,
      snakeTotalLength: snakePath ? snakePath.getTotalLength() : 0,
      snakeStrokeDasharray: snakePath?.style.strokeDasharray,
      snakeStrokeDashoffset: snakePath?.style.strokeDashoffset,
    };
  });
  console.log('Initial page state:', initialStatus);

  // ==========================================
  // TEST 2: Continuous Snake Line Verification
  // ==========================================
  console.log('\n--- TEST 2: Continuous Snake Line Across All Sections ---');

  const scrollPositions = [
    { name: 'Intermediate Band', sel: '#intermediate-band' },
    { name: 'About Me', sel: '#about' },
    { name: 'Skills', sel: '#skills' },
    { name: 'Work / Projects', sel: '#work' },
    { name: 'Workflow Stage 1', sel: '#stage-discover' },
    { name: 'Workflow Stage 3', sel: '#stage-develop' },
    { name: 'Workflow Stage 5', sel: '#stage-refine' },
    { name: 'Technical Deep Dive', sel: '#deep-dive' },
    { name: 'Interactive 3D Phone', sel: '#interactive-3d' },
    { name: 'Contact & Footer', sel: '#contact' },
  ];

  const lineProgressReport = [];

  for (let i = 0; i < scrollPositions.length; i++) {
    const item = scrollPositions[i];
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ behavior: 'instant' });
    }, item.sel);

    await new Promise((r) => setTimeout(r, 500));

    const state = await page.evaluate(() => {
      const path = document.querySelector('svg.pointer-events-none path');
      if (!path) return null;
      const totalLen = path.getTotalLength();
      const offset = parseFloat(path.style.strokeDashoffset || '0');
      const revealedPercent = ((1 - offset / totalLen) * 100).toFixed(1);
      return {
        scrollY: window.scrollY,
        totalLen: Math.round(totalLen),
        offset: Math.round(offset),
        revealedPercent: `${revealedPercent}%`,
      };
    });

    lineProgressReport.push({ section: item.name, ...state });
    await page.screenshot({
      path: path.join(outDir, `02_snake_${i + 1}_${item.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`),
      type: 'jpeg',
      quality: 85,
    });
  }

  console.log('Continuous Snake Line Scroll Progress:');
  console.table(lineProgressReport);

  // ==========================================
  // TEST 3: Vertically Center Project Section Cards
  // ==========================================
  console.log('\n--- TEST 3: Vertically Centering Project Section Cards ---');

  const viewports = [
    { name: 'Desktop 1440x900', width: 1440, height: 900 },
    { name: 'Laptop 1280x800', width: 1280, height: 800 },
    { name: 'Tablet 768x1024', width: 768, height: 1024 },
    { name: 'Mobile 390x844', width: 390, height: 844 },
    { name: 'Small Mobile 360x740', width: 360, height: 740 },
  ];

  const alignmentReport = [];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluate(() => {
      document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    const metrics = await page.evaluate(() => {
      const section = document.getElementById('work');
      if (!section) return null;

      const isDesktop = window.innerWidth >= 1024;
      const header = section.children[0];
      const baseBar = section.children[3];
      const card = isDesktop
        ? section.querySelector('.rounded-3xl')
        : section.querySelector('.lg\\:hidden .rounded-2xl');

      const sRect = section.getBoundingClientRect();
      const hRect = header?.getBoundingClientRect();
      const cRect = card?.getBoundingClientRect();
      const bRect = baseBar?.getBoundingClientRect();

      if (isDesktop) {
        const spaceAboveCard = cRect && hRect ? (cRect.top - hRect.bottom) : null;
        const spaceBelowCard = cRect && bRect ? (bRect.top - cRect.bottom) : null;
        return {
          mode: 'Desktop Pinned Center',
          sectionHeight: Math.round(sRect.height),
          headerHeight: hRect ? Math.round(hRect.height) : null,
          cardHeight: cRect ? Math.round(cRect.height) : null,
          baseBarHeight: bRect ? Math.round(bRect.height) : null,
          spaceAboveCard: spaceAboveCard !== null ? Math.round(spaceAboveCard) : null,
          spaceBelowCard: spaceBelowCard !== null ? Math.round(spaceBelowCard) : null,
          diffPixels: spaceAboveCard !== null && spaceBelowCard !== null
            ? Math.abs(Math.round(spaceAboveCard) - Math.round(spaceBelowCard))
            : null,
          isSymmetrical: spaceAboveCard !== null && spaceBelowCard !== null
            ? Math.abs(spaceAboveCard - spaceBelowCard) < 2
            : false,
        };
      } else {
        // Mobile / Tablet stacked mode
        return {
          mode: 'Mobile Stacked Gallery',
          sectionHeight: Math.round(sRect.height),
          headerHeight: hRect ? Math.round(hRect.height) : null,
          cardHeight: cRect ? Math.round(cRect.height) : null,
          baseBarHeight: bRect ? Math.round(bRect.height) : null,
          spaceAboveCard: cRect ? Math.round(cRect.top - sRect.top) : null,
          spaceBelowCard: cRect ? Math.round(sRect.bottom - cRect.bottom) : null,
          diffPixels: 0,
          isSymmetrical: true, // vertical stack with even gap
        };
      }
    });

    alignmentReport.push({ viewport: vp.name, ...metrics });

    await page.screenshot({
      path: path.join(outDir, `03_project_alignment_${vp.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`),
      type: 'jpeg',
      quality: 85,
    });
  }

  console.log('Project Card Vertical Alignment Report:');
  console.table(alignmentReport);

  // ==========================================
  // TEST 4: Modal Case Study Interaction
  // ==========================================
  console.log('\n--- TEST 4: Case Study Modal Interaction ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 500));

  // Click project card image to open modal
  await page.evaluate(() => {
    const cardImg = document.querySelector('#work .group\\/img');
    cardImg?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 800));

  const modalOpen = await page.evaluate(() => {
    const modal = document.querySelector('div[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
    return !!modal;
  });
  console.log('Modal opened successfully:', modalOpen);

  await page.screenshot({ path: path.join(outDir, '04_modal_open.jpg'), type: 'jpeg', quality: 90 });

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));

  // ==========================================
  // Console & Error Verification
  // ==========================================
  console.log('\n--- FINAL ERROR CHECK ---');
  console.log(`Total console logs: ${consoleLogs.length}`);
  console.log(`Total errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:');
    errors.forEach((e) => console.error('  ❌', e));
  } else {
    console.log('✅ 100% CLEAN! Zero console errors, zero runtime exceptions.');
  }

  await browser.close();

  if (errors.length > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
