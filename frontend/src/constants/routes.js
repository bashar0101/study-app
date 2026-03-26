export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  STUDY: "/study",
  QUIZ: "/quiz",
  QUIZ_SESSION: (id) => `/quiz/${id}`,
  EXAM: "/exam",
  EXAM_SESSION: (id) => `/exam/${id}`,
  RESULTS: (id) => `/results/${id}`,
  ANALYTICS: "/analytics",
  HISTORY: "/history",
  PROFILE: "/profile",
};

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.VERIFY_EMAIL,
  ROUTES.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.STUDY,
  ROUTES.QUIZ,
  ROUTES.EXAM,
  ROUTES.ANALYTICS,
  ROUTES.HISTORY,
  ROUTES.PROFILE,
];
