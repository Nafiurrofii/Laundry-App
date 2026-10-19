import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000';

/**
 * POST /api/prediksi
 * Proxy ke Python FastAPI — menerima { kg: number } dan meneruskan ke /prediksi
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kg } = body as { kg: number };

    if (typeof kg !== 'number' || kg <= 0) {
      return NextResponse.json(
        { error: 'Parameter kg harus berupa angka positif.' },
        { status: 400 }
      );
    }

    const response = await fetch(`${PYTHON_API_URL}/prediksi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kg }),
      // timeout 8 detik agar tidak menunggu terlalu lama jika API mati
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[prediksi proxy] upstream error:', response.status, errorBody);
      return NextResponse.json(
        { error: 'Python API mengembalikan error.', detail: errorBody },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    console.error('[prediksi proxy] error:', err);

    if (isTimeout) {
      return NextResponse.json(
        { error: 'Python API tidak merespons (timeout). Pastikan server Python berjalan.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal menghubungi Python API. Pastikan server Python berjalan di port 8000.' },
      { status: 503 }
    );
  }
}

/**
 * GET /api/prediksi
 * Health check — cek apakah Python API aktif
 */
export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'error', message: 'Python API tidak merespons dengan baik.' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ status: 'ok', ...data });
  } catch {
    return NextResponse.json(
      { status: 'offline', message: 'Python API tidak berjalan.' },
      { status: 503 }
    );
  }
}
