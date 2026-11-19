import { NextRequest, NextResponse } from 'next/server';
import { updateAttachmentScanResult } from '@/lib/malware-scanner';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    const body = await request.json();
    const { attachmentId, scanStatus, scannerEngine, details } = body;

    if (!attachmentId || !scanStatus) {
      return NextResponse.json(
        { error: 'Missing attachmentId or scanStatus in payload.' },
        { status: 400 }
      );
    }

    if (scanStatus !== 'CLEAN' && scanStatus !== 'QUARANTINED') {
      return NextResponse.json(
        { error: 'Invalid scanStatus. Must be CLEAN or QUARANTINED.' },
        { status: 400 }
      );
    }

    const result = await updateAttachmentScanResult(
      attachmentId,
      {
        scanStatus,
        scannerEngine: scannerEngine || 'ExternalScanner',
        scannedAt: new Date(),
        details,
      },
      token
    );

    if (!result.success) {
      const isAuth = result.error?.includes('Unauthorized');
      return NextResponse.json(
        { error: result.error },
        { status: isAuth ? 401 : 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error processing scan result.' },
      { status: 500 }
    );
  }
}
