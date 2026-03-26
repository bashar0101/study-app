const bcrypt = require('bcryptjs');
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

  return prisma.user.create({
    data: {
      name: userBody.name,
      email: userBody.email,
      passwordHash: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
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

module.exports = {
  createUser,
  getUserByEmail,
};
