import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const JUDGE_SYSTEM = `You are a quality evaluator. Score the AI response 0-100 based on:
- Accuracy (does it match the expected answer?)
- Helpfulness (is it useful and complete?)
- Coherence (is it well-structured and clear?)

Return JSON: {"score": <number>, "reasoning": "<brief explanation>"}`;

type JudgeResult = { score: number; reasoning: string };

async function judgeWithAnthropic(
  prompt: string,
  expected: string,
  actual: string,
): Promise<JudgeResult> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Test prompt: ${prompt}\nExpected answer: ${expected}\nActual answer: ${actual}\n\nEvaluate:`,
      },
    ],
    system: JUDGE_SYSTEM,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  const parsed = JSON.parse(text);
  return {
    score: Math.min(100, Math.max(0, parseInt(parsed.score) || 0)),
    reasoning: parsed.reasoning || 'No reasoning provided',
  };
}

async function judgeWithOpenAI(
  prompt: string,
  expected: string,
  actual: string,
): Promise<JudgeResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      { role: 'system', content: JUDGE_SYSTEM },
      {
        role: 'user',
        content: `Test prompt: ${prompt}\nExpected answer: ${expected}\nActual answer: ${actual}\n\nEvaluate:`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content || '{}';
  const parsed = JSON.parse(content);
  return {
    score: Math.min(100, Math.max(0, parseInt(parsed.score) || 0)),
    reasoning: parsed.reasoning || 'No reasoning provided',
  };
}

export async function evaluateQuality(
  prompt: string,
  expected: string,
  actual: string,
): Promise<{ score: number; reasoning: string; judge: string }> {
  // Primary: Claude Opus 4.6 (best quality judge)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await judgeWithAnthropic(prompt, expected, actual);
      return { ...result, judge: 'claude-opus-4-6' };
    } catch (err) {
      console.error('Anthropic judge failed, falling back:', err);
    }
  }

  // Fallback: GPT-5.4
  if (process.env.OPENAI_API_KEY) {
    const result = await judgeWithOpenAI(prompt, expected, actual);
    return { ...result, judge: 'gpt-5.4' };
  }

  throw new Error('No judge API keys configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
}
