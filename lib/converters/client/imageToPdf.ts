import jsPDF from 'jspdf';

export async function convertImageToPdf(files: File[]): Promise<Blob> {
  const pdf = new jsPDF();
  const maxWidth = 190; // A4 width in mm
  const maxHeight = 277; // A4 height in mm
  const margin = 10;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i > 0) {
      pdf.addPage();
    }

    try {
      const imageData = await fileToBase64(file);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          let imgWidth = img.width;
          let imgHeight = img.height;
          const ratio = Math.min(
            (maxWidth - margin * 2) / imgWidth,
            (maxHeight - margin * 2) / imgHeight
          );

          imgWidth = imgWidth * ratio;
          imgHeight = imgHeight * ratio;

          const x = (maxWidth - imgWidth) / 2;
          const y = (maxHeight - imgHeight) / 2;

          // Determine image format from file type or data URL
          const format = file.type.includes('png') ? 'PNG' : 
                        file.type.includes('gif') ? 'GIF' : 
                        file.type.includes('webp') ? 'WEBP' : 'JPEG';
          
          pdf.addImage(imageData, format, x, y, imgWidth, imgHeight);
          resolve();
        };
        img.onerror = reject;
        img.src = imageData;
      });
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error);
      throw new Error(`Failed to process image: ${file.name}`);
    }
  }

  return new Blob([pdf.output('blob')], { type: 'application/pdf' });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

