import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serviceSupabase } from '@/lib/supabase';

const eventSchema = z.object({
  visitorId: z.string().min(8).max(80),
  event: z.enum(['visit', 'download']),
  videoUrl: z.string().max(2000).optional(),
});

function getDevice(userAgent: string) {
  if (/mobile|android|iphone|ipad/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent: string) {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome|crios/i.test(userAgent)) return 'Chrome';
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  return 'Other';
}

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Invalid analytics event.' }, { status: 400 });
  const database = serviceSupabase();
  if (!database) return NextResponse.json({ message: 'Analytics is not configured.' }, { status: 503 });

  const headers = request.headers;
  const { error } = await database.from('visitor_events').insert({
    visitor_id: parsed.data.visitorId,
    event_type: parsed.data.event,
    video_url: parsed.data.videoUrl || null,
    device: getDevice(headers.get('user-agent') || ''),
    browser: getBrowser(headers.get('user-agent') || ''),
    country: headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || 'Unknown',
    city: headers.get('x-vercel-ip-city') || 'Unknown',
  });
  if (error) return NextResponse.json({ message: 'Could not save analytics.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
