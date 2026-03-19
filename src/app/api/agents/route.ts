import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// CRUD for agents
export async function GET() {
  const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('agents')
    .insert({
      name: body.name,
      gateway_url: body.gateway_url,
      test_prompt: body.test_prompt,
      expected_answer: body.expected_answer,
      check_interval: body.check_interval || 60,
      threshold: body.threshold || 70,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const { error } = await supabase.from('agents').delete().eq('id', id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
