const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Load the static HTML file
        const filePath = `file://${path.join(__dirname, 'cheatsheet_static.html')}`;
        await page.goto(filePath, { waitUntil: 'networkidle2' });

        // Add custom CSS for better PDF rendering
        await page.addStyleTag({
            content: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            background-color: white !important;
          }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
      `
        });

        // Generate PDF
        await page.pdf({
            path: 'AWS_Exam_Topics_CheatSheet.pdf',
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            printBackground: true
        });

        console.log('PDF generated successfully: AWS_Exam_Topics_CheatSheet.pdf');
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
})();
