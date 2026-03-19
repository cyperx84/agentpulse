# AgentPulse — Agent Quality Monitor

Register agents → scheduled test prompts → LLM-as-judge scoring → quality dashboard → alerts.

## Stack
- Next.js App Router + TypeScript
- Supabase (PostgreSQL + Auth)
- OpenAI API (LLM-as-judge)
- Vercel Cron (scheduled checks)

## MVP
- [ ] Register agent (gateway URL + test prompt + expected answer)
- [ ] Scheduled checks run automatically (hourly free, 15min pro)
- [ ] LLM-as-judge scores responses
- [ ] Quality dashboard with history chart
- [ ] Email alert on score drop below threshold

## Getting Started
```bash
npm install
cp .env.example .env.local
npm run dev
```
