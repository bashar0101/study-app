import { z } from "zod";

export const startStudySchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z.string().min(1, "Answer is required"),
  timeSpentSec: z.number().int().min(0).optional(),
});

export const requestHintSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  hintNumber: z.number().int().min(1).max(3),
});
