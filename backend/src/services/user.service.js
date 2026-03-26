const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(400, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  return prisma.user.create({
    data: {
      name: userBody.name,
      email: userBody.email,
      passwordHash: hashedPassword,
      verificationToken,
    },
    select: {
      id: true,
      name: true,
      email: true,
      verificationToken: true,
      createdAt: true,
    },
  });
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Get user profile with sessions and analytics
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserProfile = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      sessions: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      analytics: true,
    },
  });
};

/**
 * Verify user email
 * @param {string} token
 * @returns {Promise<User>}
 */
const verifyUserEmail = async (token) => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
    },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserProfile,
  verifyUserEmail,
};
