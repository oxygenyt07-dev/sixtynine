import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { serviceSupabase } from '@/lib/supabase';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  const database = serviceSupabase();
  if (!database) return NextResponse.json({ message: 'Analytics is not configured.' }, { status: 503 });
  const { data, error } = await database.from('visitor_events').select('visitor_id,event_type,video_url,device,browser,country,city,created_at').order('created_at', { ascending: false }).limit(500);
  if (error) return NextResponse.json({ message: 'Could not load analytics.' }, { status: 500 });
  const events = data || [];
  return NextResponse.json({
    totals: {
      visitors: new Set(events.filter((event) => event.event_type === 'visit').map((event) => event.visitor_id)).size,
      downloads: events.filter((event) => event.event_type === 'download').length,
    },
    events,
  });
}
