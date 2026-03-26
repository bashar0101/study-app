const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/env');
const { AI_MAX_TOKENS } = require('../utils/constants');

const client = new Anthropic({ apiKey: config.ai.apiKey });

/**
 * Generate questions using Claude AI
 */
const generateQuestions = async ({
  subject,
  topic,
  difficulty,
  questionType,
  count,
  previousQuestions = [],
}) => {
  const previousList =
    previousQuestions.length > 0
      ? `\nDo NOT repeat these previous questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

  const typeInstruction = questionType === 'MCQ'
    ? 'For MCQ: exactly 4 options, one correct, three plausible distractors.'
    : questionType === 'TRUE_FALSE'
    ? 'For True/False: the correct answer must be exactly "True" or "False".'
    : questionType === 'ESSAY'
    ? 'For Essay: create open-ended questions that require detailed written answers.'
    : 'For Short Answer: expect a brief 1-3 sentence response.';

  const systemPrompt = `You are an expert academic question generator. Generate ${count} ${difficulty.toLowerCase()} ${questionType} questions about ${topic || 'general topics'} in ${subject}.

Rules:
- Questions must be clear, unambiguous, and educationally valuable
- ${typeInstruction}
- Include a brief explanation for the correct answer
${previousList}
- Respond ONLY in valid JSON format

Output format:
[{
  "questionText": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "...",
  "explanation": "..."
}]

For non-MCQ types, omit the "options" field.`;

  for (let attempt = 0; attempt < config.ai.maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: config.ai.model,
        max_tokens: AI_MAX_TOKENS.QUESTIONS,
        messages: [{ role: 'user', content: 'Generate the questions now.' }],
        system: systemPrompt,
      });

      const text = response.content[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response');

      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (err) {
      if (attempt === config.ai.maxRetries - 1) {
        console.error('AI question generation failed after retries:', err.message);
        throw new Error('Failed to generate questions. Please try again.');
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

/**
 * Evaluate a student's answer using Claude AI
 */
const evaluateAnswer = async ({ questionText, correctAnswer, userAnswer, questionType }) => {
  const typeGuidance = questionType === 'ESSAY'
    ? 'For essays: evaluate thesis clarity, argument strength, evidence use, and coherence.'
    : 'For short answers: check factual correctness and completeness.';

  const systemPrompt = `You are a fair and constructive academic evaluator.

Question: ${questionText}
Reference answer: ${correctAnswer}
Student's answer: ${userAnswer}

Evaluate the student's answer. Be encouraging but honest.
${typeGuidance}

Respond ONLY in valid JSON:
{
  "score": 0-100,
  "isCorrect": true/false,
  "feedback": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}`;

  for (let attempt = 0; attempt < config.ai.maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: config.ai.model,
        max_tokens: AI_MAX_TOKENS.EVALUATION,
        messages: [{ role: 'user', content: 'Evaluate the answer now.' }],
        system: systemPrompt,
      });

      const text = response.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      if (attempt === config.ai.maxRetries - 1) {
        console.error('AI evaluation failed after retries:', err.message);
        return {
          score: 0,
          isCorrect: false,
          feedback: 'Unable to evaluate answer at this time.',
          strengths: [],
          improvements: [],
        };
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

/**
 * Generate progressive hints
 */
const generateHints = async ({ questionText, subject, topic }) => {
  const systemPrompt = `You are a helpful tutor. Generate 3 progressive hints for this question about ${topic || subject}:

"${questionText}"

Rules:
- Hint 1: A vague nudge in the right direction
- Hint 2: A more specific hint
- Hint 3: Almost gives away the answer without stating it directly

Respond ONLY in valid JSON:
{ "hints": ["hint1", "hint2", "hint3"] }`;

  try {
    const response = await client.messages.create({
      model: config.ai.model,
      max_tokens: AI_MAX_TOKENS.HINTS,
      messages: [{ role: 'user', content: 'Generate the hints now.' }],
      system: systemPrompt,
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.hints || [];
  } catch (err) {
    console.error('AI hints generation failed:', err.message);
    return ['Think about the key concepts related to this topic.',
            'Consider the main principles involved.',
            'The answer relates to a fundamental aspect of this subject.'];
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateHints,
};
