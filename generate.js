// generate.js
const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(inputFile, outputFile) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const filePath = path.join(__dirname, inputFile);
    await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    console.log(`✅ PDF Generated Successfully: ${outputFile}`);
}

(async () => {
    await generatePDF('cv.html', 'David_Cooper_CV.pdf');
    await generatePDF('cv_en.html', 'David_Cooper_CV_EN.pdf');
})();