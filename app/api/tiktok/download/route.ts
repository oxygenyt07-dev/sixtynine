import { NextResponse } from 'next/server';

function isTrustedVideoUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:') return false;

  const hostname = url.hostname.toLowerCase();
  const trustedHosts = [
    'tikwm.com',
    'tiktok.com',
    'tiktokcdn.com',
    'tiktokv.com',
    'tiktokcdn-us.com',
    'ibytedtos.com',
    'muscdn.com',
  ];

  return trustedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url');
  if (!target) return NextResponse.json({ message: 'Download URL is missing.' }, { status: 400 });

  try {
    if (!isTrustedVideoUrl(target)) return NextResponse.json({ message: 'Invalid download URL.' }, { status: 400 });
  } catch {
    return NextResponse.json({ message: 'Invalid download URL.' }, { status: 400 });
  }

  const response = await fetch(target, {
    headers: { 'user-agent': 'SixtyNine TikTok Downloader/1.0' },
    cache: 'no-store',
  });
  if (!response.ok || !response.body) {
    return NextResponse.json({ message: 'Video download failed. Please try again.' }, { status: 502 });
  }

  return new NextResponse(response.body, {
    headers: {
      'content-type': response.headers.get('content-type') || 'video/mp4',
      'content-disposition': 'attachment; filename="sixtynine-tiktok-video.mp4"',
      'cache-control': 'no-store',
    },
  });
}
