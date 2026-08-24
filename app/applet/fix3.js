const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "} 'result':";
const endMarker = "function P11FinalGame";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found!");
  process.exit(1);
}

const replacement = "}\n\n";

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully replaced block!");
