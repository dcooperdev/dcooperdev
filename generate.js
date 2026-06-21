// generate.js
const puppeteer = require('puppeteer');
const path = require('path');

// 297mm at 96 DPI (CSS pixels)
const A4_HEIGHT_PX = 297 * (96 / 25.4);

async function checkOverflow(inputFile) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    const filePath = path.join(__dirname, inputFile);
    await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

    const result = await page.evaluate((limit) => {
        const pageEl = document.querySelector('.page');
        pageEl.style.height = 'auto';
        pageEl.style.overflow = 'visible';
        document.querySelector('.sidebar').style.height = 'auto';
        document.querySelector('.main').style.height = 'auto';

        const actualHeight = pageEl.scrollHeight;
        return {
            actualHeight: Math.round(actualHeight),
            limit: Math.round(limit),
            overflowPx: Math.round(actualHeight - limit)
        };
    }, A4_HEIGHT_PX);

    await browser.close();
    return result;
}

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
    const files = [
        { html: 'cv.html',    pdf: 'David_Cooper_CV.pdf' },
        { html: 'cv_en.html', pdf: 'David_Cooper_CV_EN.pdf' },
    ];

    let hasOverflow = false;

    for (const { html } of files) {
        const { actualHeight, limit, overflowPx } = await checkOverflow(html);
        if (overflowPx > 0) {
            console.error(`❌ Overflow detected in ${html}: content is ${actualHeight}px, A4 limit is ${limit}px (+${overflowPx}px)`);
            hasOverflow = true;
        } else {
            console.log(`✅ ${html}: ${actualHeight}px / ${limit}px (${Math.abs(overflowPx)}px margin)`);
        }
    }

    if (hasOverflow) {
        process.exit(1);
    }

    for (const { html, pdf } of files) {
        await generatePDF(html, pdf);
    }
})();
