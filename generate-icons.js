import sharp from 'sharp';
import fs from 'fs';

const svgBuffer = fs.readFileSync('./public/logo.svg');

sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile('./public/logo-192.png')
  .then(() => console.log('Created logo-192.png'))
  .catch(err => console.error(err));

sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('./public/logo-512.png')
  .then(() => console.log('Created logo-512.png'))
  .catch(err => console.error(err));
