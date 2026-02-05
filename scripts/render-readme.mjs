import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const branding = JSON.parse(fs.readFileSync(path.join(root, 'branding.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'README.template.md'), 'utf8');

function badgesMd(badges) {
  return badges.map(b => `![${b.label}](${b.url})`).join(' ');
}

const md = template
  .replace(/{{NAME}}/g, branding.name)
  .replace(/{{TAGLINE}}/g, branding.tagline)
  .replace(/{{BADGES}}/g, badgesMd(branding.badgesMd || []))
  .replace(/{{QUICKSTART}}/g, branding.quickstart)
  .replace(/{{DEMO}}/g, branding.demo)
  .replace(/{{WHY}}/g, branding.why)
  .replace(/{{FAQ}}/g, branding.faq)
  .replace(/{{CONTRIBUTING}}/g, branding.contributing)
  .replace(/{{LICENSE}}/g, branding.license);

fs.writeFileSync(path.join(root, 'README.md'), md);
