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
