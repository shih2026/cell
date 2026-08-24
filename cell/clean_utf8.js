const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.tsx');
console.log('Reading file:', filePath);
if (!fs.existsSync(filePath)) {
  console.error('File does not exist:', filePath);
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);

const decoded = buffer.toString('utf-8');
const reencoded = Buffer.from(decoded, 'utf-8');

if (buffer.equals(reencoded)) {
  console.log('File is already valid UTF-8.');
} else {
  console.log('File has invalid UTF-8 bytes! Cleaning up...');
  fs.writeFileSync(filePath, decoded, 'utf-8');
  console.log('File successfully cleaned.');
}
