import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const branding = JSON.parse(fs.readFileSync(path.join(root, 'branding.json'), 'utf8'));
const styles = fs.readFileSync(path.join(root, 'assets/styles.css'), 'utf8');
const template = fs.readFileSync(path.join(root, 'assets/og-template.html'), 'utf8');
const logo = fs.readFileSync(path.join(root, branding.logo || 'assets/logo.svg'), 'utf8');

function badgeHtml(b) {
  return `<span class="badge">${b.label}: ${b.value}</span>`;
}

function beforeAfterHtml(ba) {
  if (!ba) return '';
  return `
    <div class="card"><h4>Before</h4><p>${ba.before}</p></div>
    <div class="card"><h4>After</h4><p>${ba.after}</p></div>
  `;
}

const badges = (branding.badges || []).slice(0, 4).map(badgeHtml).join('');
const html = template
  .replace('{{STYLES}}', styles)
  .replace('{{W}}', '1200')
  .replace('{{H}}', '630')
  .replace('{{ACCENT_A}}', branding.accent?.[0] || '#6D28D9')
  .replace('{{ACCENT_B}}', branding.accent?.[1] || '#0EA5E9')
  .replace('{{LOGO}}', logo)
  .replace('{{TITLE}}', branding.name)
  .replace('{{TAGLINE}}', branding.tagline)
  .replace('{{BADGES}}', badges)
  .replace('{{PROOF}}', branding.proof || '')
  .replace('{{BEFORE_AFTER}}', beforeAfterHtml(branding.beforeAfter))
  .replace('{{FOOTER}}', branding.footer || '');

const outHtml = path.join(root, 'assets/.og.html');
fs.writeFileSync(outHtml, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + outHtml, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(root, 'assets/og.png') });
await browser.close();
