const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { redisClient } = require('../config/redis');
const { REDIS_KEYS } = require('../utils/constants');
const ApiError = require('../utils/apiError');

const createUser = async ({ name, email, password }) => {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new ApiError(400, 'Email already taken');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Store token in Redis with 24h TTL
  try {
    await redisClient.set(
      REDIS_KEYS.EMAIL_VERIFY(verificationToken),
      email,
      { EX: 24 * 60 * 60 }
    );
  } catch {
    // Redis may not be connected
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash, verificationToken },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return { ...user, verificationToken };
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const getUserProfile = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
};

const verifyUserEmail = async (token) => {
  // Check Redis first
  let email;
  try {
    email = await redisClient.get(REDIS_KEYS.EMAIL_VERIFY(token));
  } catch {
    // Fallback to DB
  }

  let user;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
    await redisClient.del(REDIS_KEYS.EMAIL_VERIFY(token));
  } else {
    user = await prisma.user.findFirst({ where: { verificationToken: token } });
  }

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  return prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, verificationToken: null },
  });
};

const updateProfile = async (userId, updates) => {
  const allowed = {};
  if (updates.name) allowed.name = updates.name;
  if (updates.avatarUrl !== undefined) allowed.avatarUrl = updates.avatarUrl;

  return prisma.user.update({
    where: { id: userId },
    data: allowed,
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};

const generateResetToken = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) return; // Don't reveal if user exists

  const resetToken = crypto.randomBytes(32).toString('hex');

  try {
    await redisClient.set(REDIS_KEYS.RESET_TOKEN(resetToken), user.id, {
      EX: 60 * 60, // 1 hour
    });
  } catch {
    // Fallback to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  return { user, resetToken };
};

const resetPassword = async (token, newPassword) => {
  let userId;

  try {
    userId = await redisClient.get(REDIS_KEYS.RESET_TOKEN(token));
    if (userId) await redisClient.del(REDIS_KEYS.RESET_TOKEN(token));
  } catch {
    // Fallback to DB
  }

  if (!userId) {
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
    });
    if (!user) throw new ApiError(400, 'Invalid or expired reset token');
    userId = user.id;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserProfile,
  verifyUserEmail,
  updateProfile,
  changePassword,
  generateResetToken,
  resetPassword,
};
