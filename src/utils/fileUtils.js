import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      const base64Data = result.split(',')[1];
      resolve({
        mimeType: file.type || 'application/pdf',
        base64: base64Data
      });
    };
    reader.onerror = error => reject(error);
  });
};

export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          let text = '';
          const fileType = file.type || '';
          const fileName = file.name || '';

          if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
            try {
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              let extractedText = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                extractedText += pageText + ' ';
              }
              text = extractedText;
            } catch (pdfErr) {
              const error = new Error('Unable to read this PDF file.');
              error.type = 'PDF_EXTRACTION_FAILURE';
              error.original = pdfErr;
              throw error;
            }
          } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.toLowerCase().endsWith('.docx')) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer });
              text = result.value;
            } catch (docxErr) {
              const error = new Error('Unable to process this DOCX file.');
              error.type = 'DOCX_EXTRACTION_FAILURE';
              error.original = docxErr;
              throw error;
            }
          } else if (fileType.startsWith('text/') || fileName.toLowerCase().endsWith('.txt')) {
            const textDecoder = new TextDecoder('utf-8');
            text = textDecoder.decode(arrayBuffer);
          } else {
            const error = new Error('Unsupported file format.');
            error.type = 'UNSUPPORTED_FILE';
            throw error;
          }
          
          resolve(text.trim());
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};

export const optimizeLargeResumeText = (text, maxLength = 25000) => {
  if (!text) return '';
  
  // Clean whitespace and repeated newlines
  let cleanText = text.replace(/\n\s*\n/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
  
  if (cleanText.length <= maxLength) return cleanText;

  // Split by double newlines to keep sections intact
  const chunks = cleanText.split('\n\n');
  let optimizedText = '';
  
  for (const chunk of chunks) {
    // Ignore purely decorative chunks
    if (/^[=_\-*\| ]+$/.test(chunk.trim())) continue;
    
    if (optimizedText.length + chunk.length + 2 > maxLength) {
      optimizedText += '\n\n...[Content truncated to optimize AI processing]';
      break;
    }
    optimizedText += chunk + '\n\n';
  }
  
  return optimizedText.trim();
};
