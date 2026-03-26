module.exports = {
  SESSION_MODES: {
    STUDY: 'STUDY',
    QUIZ: 'QUIZ',
    EXAM: 'EXAM',
  },
  SESSION_STATUS: {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ABANDONED: 'ABANDONED',
  },
  QUESTION_TYPES: {
    MCQ: 'MCQ',
    TRUE_FALSE: 'TRUE_FALSE',
    SHORT_ANSWER: 'SHORT_ANSWER',
    ESSAY: 'ESSAY',
  },
  DIFFICULTY: {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
  },
  REDIS_KEYS: {
    QUESTIONS: (subject, topic, difficulty) =>
      `studyai:questions:${subject}:${topic || 'all'}:${difficulty}`,
    EMAIL_VERIFY: (token) => `studyai:email_verify:${token}`,
    RESET_TOKEN: (token) => `studyai:reset:${token}`,
    BLACKLIST: (token) => `studyai:blacklist:${token}`,
  },
  AI_MAX_TOKENS: {
    QUESTIONS: 4096,
    EVALUATION: 1024,
    HINTS: 512,
  },
};
