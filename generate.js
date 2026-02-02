// generate.js
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        // Add these arguments to make it work in GitHub Actions:
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Loads the local file
    const filePath = path.join(__dirname, 'cv.html');
    await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

    // Generates the PDF with the same options used manually
    await page.pdf({
        path: 'David_Cooper_CV.pdf',
        format: 'A4',
        printBackground: true, // Important for background colors to appear
        margin: { top: '0', right: '0', bottom: '0', left: '0' } // No extra margins
    });

    await browser.close();
    console.log('✅ PDF Generated Successfully: David_Cooper_CV.pdf');
})();