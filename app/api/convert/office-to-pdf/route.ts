import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversionType = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Note: LibreOffice headless requires system installation
    // For Netlify serverless, you'd need to:
    // 1. Use an external API service (CloudConvert, etc.)
    // 2. Use a Docker container with LibreOffice
    // 3. Use a separate service/worker for heavy processing
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    return NextResponse.json({
      message: 'Office document conversion requires additional setup',
      fileType: fileExtension,
      conversionType,
      note: 'For production, consider using CloudConvert API, LibreOffice in Docker, or a dedicated conversion service',
      size: buffer.length,
    });
  } catch (error) {
    console.error('Office to PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to process office document' },
      { status: 500 }
    );
  }
}


