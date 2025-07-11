const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  async generate(content, template = 'modern', options = {}) {
    try {
      const html = await this.generateHTML(content, template, options);
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true
      });
      
      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.error('Erro na geração do PDF:', error);
      throw new Error('Falha na geração do PDF');
    }
  }

  async generateHTML(content, template, options) {
    const templatePath = path.join(__dirname, '../templates', `${template}.html`);
    
    try {
      let html = await fs.readFile(templatePath, 'utf8');
      html = html.replace('{{CONTENT}}', content);
      html = html.replace('{{TITLE}}', options.title || 'Currículo');
      
      return html;
    } catch (error) {
      // Template padrão se não encontrar o arquivo
      return this.getDefaultTemplate(content, options);
    }
  }

  getDefaultTemplate(content, options) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${options.title || 'Currículo'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .content { line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="content">${content}</div>
      </body>
      </html>
    `;
  }
}

module.exports = new PDFGenerator(); 