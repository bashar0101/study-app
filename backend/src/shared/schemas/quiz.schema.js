import { z } from "zod";

export const startQuizSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  questionCount: z.enum(["5", "10", "15", "20"]).transform(Number).default("10"),
});

export const submitQuizAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z.string().min(1, "Answer is required"),
  timeSpentSec: z.number().int().min(0).optional(),
});

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
      timeSpentSec: z.number().int().min(0).optional(),
    })
  ),
});
