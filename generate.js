// generate.js
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Carga el archivo local
    const filePath = path.join(__dirname, 'cv.html');
    await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

    // Genera el PDF con las mismas opciones que usamos manual
    await page.pdf({
        path: 'David_Cooper_CV.pdf',
        format: 'A4',
        printBackground: true, // Importante para que salgan los colores de fondo
        margin: { top: '0', right: '0', bottom: '0', left: '0' } // Sin márgenes extra
    });

    await browser.close();
    console.log('✅ PDF Generado Exitosamente: David_Cooper_CV.pdf');
})();