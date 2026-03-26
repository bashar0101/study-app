export const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Easy", color: "text-green-600", bg: "bg-green-100" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" },
  { value: "HARD", label: "Hard", color: "text-red-600", bg: "bg-red-100" },
];

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];

export const SESSION_MODES = {
  STUDY: "STUDY",
  QUIZ: "QUIZ",
  EXAM: "EXAM",
};

export const SESSION_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED",
};

export const QUESTION_TYPES = {
  MCQ: "MCQ",
  TRUE_FALSE: "TRUE_FALSE",
  SHORT_ANSWER: "SHORT_ANSWER",
  ESSAY: "ESSAY",
};
