const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

class DOCXGenerator {
  async generate(content, template = 'modern', options = {}) {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: this.parseContent(content)
        }]
      });

      return await Packer.toBuffer(doc);
    } catch (error) {
      console.error('Erro na geração do DOCX:', error);
      throw new Error('Falha na geração do DOCX');
    }
  }

  parseContent(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const children = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#')) {
        // Título
        const level = trimmedLine.match(/^#+/)[0].length;
        children.push(
          new Paragraph({
            text: trimmedLine.replace(/^#+\s*/, ''),
            heading: level === 1 ? HeadingLevel.HEADING_1 : 
                     level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3
          })
        );
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        // Lista
        children.push(
          new Paragraph({
            text: trimmedLine.replace(/^[•-]\s*/, ''),
            bullet: { level: 0 }
          })
        );
      } else if (trimmedLine) {
        // Texto normal
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 24
              })
            ]
          })
        );
      }
    });

    return children;
  }
}

module.exports = new DOCXGenerator(); 