export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
    updateProfile: "/auth/profile",
    changePassword: "/auth/change-password",
  },
  tests: {
    list: "/tests",
    history: "/tests/history",
  },
  mbti: {
    questions: "/mbti/questions",
    submit: "/mbti/submit",
  },
  cityMatch: {
    questions: "/city-match/questions",
  },
} as const;
