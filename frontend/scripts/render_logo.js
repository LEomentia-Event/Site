const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SVG = path.join(__dirname, '..', 'src', 'assets', 'logo-light.svg');
const OUT = process.argv[2] || '/tmp/logo-light.png';
const WIDTH = parseInt(process.argv[3] || '1400', 10);
const HEIGHT = Math.round(WIDTH * 185.45 / 374.57);

(async () => {
  const svg = fs.readFileSync(SVG, 'utf8');
  const html = `<!DOCTYPE html><html><head><style>
    html,body{margin:0;padding:0;background:transparent;}
    svg{width:${WIDTH}px;height:${HEIGHT}px;display:block;}
  </style></head><body>${svg}</body></html>`;
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const el = await page.$('svg');
  await el.screenshot({ path: OUT, omitBackground: true });
  await browser.close();
  console.log('logo rendered', OUT, WIDTH, 'x', HEIGHT);
})();
