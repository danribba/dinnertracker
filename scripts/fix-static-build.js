const fs = require('fs');
const path = require('path');

// Sökvägar
const publicDir = path.join(__dirname, '../public');
const outDir = path.join(__dirname, '../out_tmp');

console.log('Fixing static build...');

// Skapa .nojekyll för GitHub Pages
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// Kopiera 404.html till out_tmp
fs.copyFileSync(
  path.join(publicDir, '404.html'),
  path.join(outDir, '404.html')
);
console.log('Copied 404.html');

// Läs in den befintliga index.html
const originalIndex = fs.readFileSync(
  path.join(outDir, 'index.html'),
  'utf8'
);

// Läs in vår anpassade mall
const customTemplate = fs.readFileSync(
  path.join(publicDir, 'index-custom.html'),
  'utf8'
);

// Extrahera Next.js-skript från originalfilen
const scriptRegex = /<script[\s\S]*?<\/script>/g;
const scripts = originalIndex.match(scriptRegex) || [];
console.log(`Found ${scripts.length} scripts in original index.html`);

// Filtrera ut cloudflare-skript
const filteredScripts = scripts.filter(script => !script.includes('cloudflare'));
console.log(`After filtering: ${filteredScripts.length} scripts remain`);

// Lägg till skripten i vår anpassade mall
let finalHtml = customTemplate.replace(
  '<!-- Inkludera Next.js-skript här (kopiera från genererad index.html) -->', 
  filteredScripts.join('\n')
);

// Fixa relativa sökvägar
finalHtml = finalHtml.replace(/\.\/\_next\//g, '_next/');

// Skriv den nya index.html
fs.writeFileSync(
  path.join(outDir, 'index.html'),
  finalHtml
);
console.log('Created custom index.html');

// Fixa alla HTML-filer för att använda rätt sökvägar
const fixAllHtmlFiles = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixAllHtmlFiles(fullPath);
    } else if (file.name.endsWith('.html') && file.name !== 'index.html' && file.name !== '404.html') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fixa relativa sökvägar
      content = content.replace(/\.\/\_next\//g, '_next/');
      
      // Blockera cloudflare
      content = content.replace(/cloudflare/g, 'blocked-cloudflare');
      content = content.replace(/www\.dinnertracker\.com/g, 'localhost');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Fixed: ${fullPath}`);
    }
  }
};

fixAllHtmlFiles(outDir);

console.log('Static build fixed successfully!'); 