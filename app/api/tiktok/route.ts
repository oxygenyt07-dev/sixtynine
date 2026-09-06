import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  url: z.string().url(),
  quality: z.enum(['720p', 'max']).default('max'),
});

function isTikTokUrl(value: string) {
  const hostname = new URL(value).hostname.toLowerCase();
  return hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success || !isTikTokUrl(parsed.data.url)) {
    return NextResponse.json({ message: 'Paste a valid TikTok video URL.' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(parsed.data.url)}`, {
      headers: { accept: 'application/json', 'user-agent': 'SixtyNine TikTok Downloader/1.0' },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'TikTok could not be reached right now. Try again shortly.' }, { status: 502 });
    }

    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('data' in result)) {
      return NextResponse.json({ message: 'The video could not be resolved.' }, { status: 422 });
    }

    const data = result.data;
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ message: 'The video could not be resolved.' }, { status: 422 });
    }

    const record = data as Record<string, unknown>;
    const preferredUrl = parsed.data.quality === 'max'
      ? (record.hdplay ?? record.play)
      : (record.play ?? record.hdplay);

    if (typeof preferredUrl !== 'string' || !preferredUrl) {
      return NextResponse.json({ message: 'No watermark-free video was returned for this link.' }, { status: 422 });
    }

    return NextResponse.json({
      downloadUrl: preferredUrl,
      title: typeof record.title === 'string' ? record.title : 'TikTok video',
    });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'The resolver took too long. Please try again.'
      : 'Unable to resolve this TikTok link right now.';
    return NextResponse.json({ message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
