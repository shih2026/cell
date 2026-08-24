const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// I will just use a simpler replace strategy to handle the variables
content = content.replace(/src=\{\`\/images\/\$\{([^\}]+)\}\`\}/g, (match, p1) => {
  // If it already contains encodeURIComponent, skip
  if (p1.includes('encodeURIComponent')) return match;
  return `src={\`/images/\${encodeURIComponent(${p1} || '')}\`}`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('done');
