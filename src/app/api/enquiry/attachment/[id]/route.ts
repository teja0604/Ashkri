import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAttachmentDownload } from '@/lib/storage';
import { isDatabaseConfigured } from '@/lib/env';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid attachment ID' }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database service is currently unconfigured' },
      { status: 503 }
    );
  }

  try {
    const attachment = await prisma.enquiryAttachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Security quarantine verification:
    // Only verified CLEAN files are permitted for authorized download.
    if (attachment.scanStatus !== 'CLEAN') {
      return NextResponse.json(
        {
          error:
            'Access denied: This attachment is quarantined or pending security analysis.',
          scanStatus: attachment.scanStatus,
          scanDetails: attachment.scanDetails,
        },
        { status: 423 } // 423 Locked
      );
    }

    const download = await getAttachmentDownload(attachment.storageKey);

    if (download.signedUrl) {
      return NextResponse.redirect(download.signedUrl, { status: 307 });
    }

    if (download.buffer) {
      return new NextResponse(new Uint8Array(download.buffer), {
        status: 200,
        headers: {
          'Content-Type': attachment.mimeType,
          'Content-Disposition': `attachment; filename="${attachment.originalName}"`,
          'Content-Length': attachment.sizeBytes.toString(),
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    }

    return NextResponse.json(
      { error: 'Attachment file could not be retrieved' },
      { status: 500 }
    );
  } catch (error) {
    console.error('[Attachment Retrieval Error]', (error as Error).message);
    return NextResponse.json(
      { error: 'Internal server error while fetching attachment' },
      { status: 500 }
    );
  }
}
