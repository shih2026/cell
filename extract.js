const fs = require('fs');
const content = fs.readFileSync('.next/server/app/page.js', 'utf8');

const regex = /sourceMappingURL=data:application\/json;charset=utf-8;base64,([a-zA-Z0-9+/=]+)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const base64 = match[1];
  try {
    const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
    const json = JSON.parse(jsonStr);
    if (json.sources && json.sources.some(s => s.includes('app/page.tsx'))) {
       const idx = json.sources.findIndex(s => s.includes('app/page.tsx'));
       fs.writeFileSync('page_extracted.tsx', json.sourcesContent[idx]);
       console.log('Extracted to page_extracted.tsx');
       break;
    }
  } catch (e) {}
}
