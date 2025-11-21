# File Converter Website

A fast and reliable file converter that supports converting PPT, images, documents, and more to PDF format (and vice versa). Built with Next.js 14, TypeScript, and featuring a beautiful Neumorphic UI design.

## Features

- 🖼️ **Image to PDF** - Convert JPG, PNG, GIF, WEBP, and more to PDF
- 📄 **PDF to Image** - Extract PDF pages as images
- 📝 **DOCX to PDF** - Convert Word documents to PDF
- 🌐 **HTML to PDF** - Convert HTML files to PDF
- 📊 **PPT to PDF** - Convert PowerPoint presentations (server-side)
- ⚡ **Fast Processing** - Client-side processing for most conversions
- 🔒 **Privacy First** - Files processed in your browser when possible
- 🎨 **Beautiful UI** - Neumorphic design with dark/light theme support
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Neumorphic CSS
- **Client-side Libraries**:
  - `pdf-lib` - PDF manipulation
  - `jspdf` - PDF generation
  - `html2pdf.js` - HTML to PDF
  - `mammoth` - DOCX to HTML
- **Server-side Libraries**:
  - `sharp` - Image processing
  - `pdf2pic` - PDF to images
  - `pdf-poppler` - PDF processing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd to-pdf
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
to-pdf/
├── app/
│   ├── api/              # API routes for server-side conversions
│   ├── layout.tsx        # Root layout with theme provider
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles with Neumorphic theme
├── components/           # React components
│   ├── Converter.tsx
│   ├── ConversionCard.tsx
│   ├── FileUploader.tsx
│   ├── Header.tsx
│   └── ThemeProvider.tsx
├── hooks/               # Custom React hooks
│   └── useTheme.ts
├── lib/
│   ├── converters/      # Conversion logic
│   │   └── client/      # Client-side converters
│   └── utils/           # Utility functions
└── public/              # Static assets
```

## Supported Conversions

### Client-Side (Browser)
- Image → PDF
- PDF → Image
- HTML → PDF
- DOCX → PDF

### Server-Side (API Routes)
- Image → PDF (with Sharp)
- PDF → Images (requires additional setup)
- Office Docs → PDF (requires LibreOffice or external service)

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables if needed

Note: Some server-side conversions (like PPT to PDF) may require additional setup or external services when deploying to Netlify due to system dependencies.

## Limitations

- **File Size**: Maximum 50MB per file (configurable)
- **PPT Conversion**: Requires server-side processing with LibreOffice or external API
- **PDF to Images**: Requires system dependencies (pdf2pic/pdf-poppler) or external service

## Future Enhancements

- [ ] Batch file conversion
- [ ] More file format support
- [ ] Cloud storage integration
- [ ] API access for developers
- [ ] Premium features with ads

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


