const { z } = require('zod');

const startStudy = z.object({
  body: z.object({
    subjectId: z.string().min(1),
    topicId: z.string().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  }),
});

const submitAnswer = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
  body: z.object({
    questionId: z.string().min(1),
    answer: z.string().min(1),
    timeSpentSec: z.coerce.number().int().min(0).optional(),
  }),
});

const nextQuestion = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
});

const endSession = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
});

module.exports = { startStudy, submitAnswer, nextQuestion, endSession };
