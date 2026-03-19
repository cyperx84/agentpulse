import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function evaluateQuality(
  prompt: string,
  expected: string,
  actual: string
): Promise<{ score: number; reasoning: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a quality evaluator. Score the AI response 0-100 based on:
- Accuracy (does it match the expected answer?)
- Helpfulness (is it useful and complete?)
- Coherence (is it well-structured?)

Return JSON: {"score": <number>, "reasoning": "<brief explanation>"}`,
      },
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
