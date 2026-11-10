import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots');

async function testModal() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1600));

  // Scroll to #work
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Click "View Case Study & Screenshots" button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('#work button'));
    const caseStudyBtn = buttons.find((b) => b.textContent?.includes('View Case Study'));
    if (caseStudyBtn) {
      caseStudyBtn.click();
    }
  });

  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '05_verified_modal_open.jpg'), type: 'jpeg', quality: 90 });

  // Switch to screenshot 2
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, '05_verified_modal_next_screenshot.jpg'), type: 'jpeg', quality: 90 });

  // Close modal
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));

  await browser.close();
  console.log('✅ Modal test complete!');
}

testModal().catch(console.error);
