'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  gateway_url: string;
  check_interval: number;
  threshold: number;
  latest_score: number | null;
  checks_count: number;
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      });
  }, []);

  const runCheck = async (agentId: string) => {
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    });
    const data = await res.json();
    if (data.check) {
      setAgents((prev) =>
        prev.map((a) => (a.id === agentId ? { ...a, latest_score: data.check.score } : a))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">💚 AgentPulse</h1>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Monitored Agents</h2>
            <p className="text-gray-400 text-sm mt-1">Quality scores updated on each check</p>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No agents monitored yet</p>
            <p className="text-sm mt-2">Add your first agent to start tracking quality</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-gray-900 rounded-lg border border-gray-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <span
                    className={`text-2xl font-bold ${
                      agent.latest_score === null
                        ? 'text-gray-600'
                        : agent.latest_score >= agent.threshold
                          ? 'text-green-400'
                          : 'text-red-400'
                    }`}
                  >
                    {agent.latest_score ?? '—'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-4 truncate">{agent.gateway_url}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Threshold: {agent.threshold}</span>
                  <span>Every {agent.check_interval}m</span>
                </div>
                <button
                  onClick={() => runCheck(agent.id)}
                  className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-500 rounded text-sm font-medium transition-colors"
                >
                  Run Check Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
