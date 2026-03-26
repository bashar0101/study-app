import { z } from "zod";

export const startExamSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  topicIds: z.array(z.string()).min(1, "At least one topic is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  questionCount: z.number().int().min(5).max(50).default(20),
  timeLimitMin: z.number().int().min(5).max(180).default(60),
});

export const submitExamAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z.string().min(1, "Answer is required"),
  timeSpentSec: z.number().int().min(0).optional(),
});

export const submitExamSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
      timeSpentSec: z.number().int().min(0).optional(),
    })
  ),
});
