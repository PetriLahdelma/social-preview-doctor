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

const badges = (branding.badges || []).map(badgeHtml).join('');
const html = template
  .replace('{{STYLES}}', styles)
  .replace('{{W}}', String(branding.hero?.width || 1600))
  .replace('{{H}}', String(branding.hero?.height || 900))
  .replace('{{ACCENT_A}}', branding.accent?.[0] || '#6D28D9')
  .replace('{{ACCENT_B}}', branding.accent?.[1] || '#0EA5E9')
  .replace('{{LOGO}}', logo)
  .replaceAll('{{TITLE}}', branding.name)
  .replace('{{TAGLINE}}', branding.tagline)
  .replace('{{BADGES}}', badges)
  .replace('{{PROOF}}', branding.proof || '')
  .replace('{{BEFORE_AFTER}}', beforeAfterHtml(branding.beforeAfter))
  .replace('{{FOOTER}}', branding.footer || '');

const outHtml = path.join(root, 'assets/.hero.html');
fs.writeFileSync(outHtml, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: branding.hero?.width || 1600, height: branding.hero?.height || 900 } });
await page.goto('file://' + outHtml, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(root, 'assets/hero.png') });
await browser.close();
