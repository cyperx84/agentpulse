export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">💚 AgentPulse</h1>
          <a
            href="/dashboard"
            className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1 rounded"
          >
            Dashboard →
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold mb-4">
            Know when your agent{' '}
            <span className="text-green-400">stops being good</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Register your OpenClaw agents, set test prompts, and get LLM-judged quality
            scores. Get alerted when quality drops.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">LLM Judge</div>
              <div className="text-gray-500 text-sm mt-1">GPT-4o-mini scores every response</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Scheduled</div>
              <div className="text-gray-500 text-sm mt-1">Automatic checks from every 5 minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Alerts</div>
              <div className="text-gray-500 text-sm mt-1">Email when quality drops below threshold</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
