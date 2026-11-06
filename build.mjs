// Injects shared partials between <!-- @name --> ... <!-- /@name --> markers. Idempotent: run after editing partials.
import { readFileSync, writeFileSync } from 'node:fs';
const pages = ['index.html', 'work.html', 'growth.html', 'work/holberton-nyc.html'];
for (const page of pages) {
  const root = '../'.repeat(page.split('/').length - 1);
  let html = readFileSync(page, 'utf8');
  for (const name of ['header', 'footer']) {
    const part = readFileSync(`partials/${name}.html`, 'utf8').replaceAll('{{root}}', root).trim();
    html = html.replace(new RegExp(`<!-- @${name} -->[\\s\\S]*?<!-- /@${name} -->`), `<!-- @${name} -->\n${part}\n<!-- /@${name} -->`);
  }
  writeFileSync(page, html);
  console.log('built', page);
}
