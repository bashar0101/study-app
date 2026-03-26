export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../shared/schemas/auth.schema.js";

export {
  startStudySchema,
  submitAnswerSchema,
  requestHintSchema,
} from "../shared/schemas/study.schema.js";

export {
  startQuizSchema,
  submitQuizAnswerSchema,
  submitQuizSchema,
} from "../shared/schemas/quiz.schema.js";

export {
  startExamSchema,
  submitExamAnswerSchema,
  submitExamSchema,
} from "../shared/schemas/exam.schema.js";
