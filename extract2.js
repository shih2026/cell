const fs = require('fs');

const extractFrom = (file) => {
  if (!fs.existsSync(file)) return false;
  const content = fs.readFileSync(file, 'utf8');
  const regex = /sourceMappingURL=data:application\/json;charset=utf-8;base64,([a-zA-Z0-9+/=]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const base64 = match[1];
    try {
      const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
      const json = JSON.parse(jsonStr);
      if (json.sources && json.sources.some(s => s.includes('app/page.tsx'))) {
         const idx = json.sources.findIndex(s => s.includes('app/page.tsx'));
         fs.writeFileSync('page_extracted2.tsx', json.sourcesContent[idx]);
         console.log('Extracted from', file);
         return true;
      }
    } catch (e) {}
  }
  return false;
};

// Next.js puts client component chunks in .next/static/chunks
const dir = '.next/static/chunks/app';
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.js') && extractFrom(dir + '/' + f)) {
      break;
    }
  }
}
