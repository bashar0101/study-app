const { z } = require('zod');

const updateProfile = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    avatarUrl: z.string().url().optional().nullable(),
  }),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128)
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[0-9]/, 'Must contain number'),
  }),
});

module.exports = { updateProfile, changePassword };
