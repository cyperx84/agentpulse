import { NextRequest, NextResponse } from 'next/server';
import { supabase, Agent, Check } from '@/lib/supabase';
import { evaluateQuality } from '@/lib/judge';

// Run a quality check on an agent
export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();
    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 });

    // Fetch agent
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error || !agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Send test prompt to agent's gateway
    const gatewayResponse = await fetch(`${agent.gateway_url}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agent.api_key}` },
      body: JSON.stringify({ message: agent.test_prompt }),
    });

    if (!gatewayResponse.ok) {
      return NextResponse.json({ error: 'Gateway request failed' }, { status: 502 });
    }

    const gatewayData = await gatewayResponse.json();
    const actualAnswer = gatewayData.response || gatewayData.content || '';

    // LLM-as-judge scoring
    const { score, reasoning } = await evaluateQuality(
      agent.test_prompt,
      agent.expected_answer,
      actualAnswer
    );

    // Save check result
    const { data: check, error: checkError } = await supabase
      .from('checks')
      .insert({
        agent_id: agentId,
        score,
        response: actualAnswer.slice(0, 500),
        judge_response: reasoning,
      })
      .select()
      .single();

    if (checkError) return NextResponse.json({ error: 'Failed to save check' }, { status: 500 });

    // Check threshold and create alert if needed
    if (score < agent.threshold) {
      await supabase.from('alerts').insert({
        agent_id: agentId,
        score,
      });
    }

    return NextResponse.json({ check, alert: score < agent.threshold });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
