const { z } = require('zod');

const register = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8).max(128)
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[0-9]/, 'Must contain number'),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(1),
  }),
});

const verifyEmail = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
  }),
});

const resetPassword = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(128)
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[0-9]/, 'Must contain number'),
  }),
});

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
