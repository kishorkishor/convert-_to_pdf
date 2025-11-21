import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // For server-side, we'll use sharp to process images
    // Note: This is a simplified version. For full PDF creation, you might want to use pdfkit
    const processedImages = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const metadata = await sharp(buffer).metadata();
        return { buffer, metadata, name: file.name };
      })
    );

    // Return processed data (in a real implementation, you'd create a PDF here)
    // For now, we'll return a message indicating server-side processing
    return NextResponse.json({
      message: 'Server-side image processing complete',
      images: processedImages.map((img) => ({
        name: img.name,
        width: img.metadata.width,
        height: img.metadata.height,
      })),
    });
  } catch (error) {
    console.error('Image to PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
}


