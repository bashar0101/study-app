const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/prisma');
const { redisClient } = require('../config/redis');
const { REDIS_KEYS } = require('../utils/constants');

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const generateAuthTokens = async (user) => {
  const accessToken = generateToken(
    { userId: user.id, email: user.email, type: 'access' },
    config.jwt.accessSecret,
    config.jwt.accessExpiration
  );

  const refreshToken = generateToken(
    { userId: user.id, type: 'refresh' },
    config.jwt.refreshSecret,
    config.jwt.refreshExpiration
  );

  // Store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

const refreshAuthTokens = async (refreshToken) => {
  const payload = verifyToken(refreshToken, config.jwt.refreshSecret);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  // Check if blacklisted
  const isBlacklisted = await redisClient.get(REDIS_KEYS.BLACKLIST(refreshToken));
  if (isBlacklisted) {
    throw new Error('Token has been revoked');
  }

  // Rotate: blacklist old, generate new
  await blacklistToken(refreshToken);
  return generateAuthTokens(user);
};

const blacklistToken = async (token) => {
  try {
    await redisClient.set(REDIS_KEYS.BLACKLIST(token), '1', { EX: 7 * 24 * 60 * 60 });
  } catch {
    // Redis might not be connected - continue
  }
};

const revokeRefreshToken = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.refreshToken) {
    await blacklistToken(user.refreshToken);
  }
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
  refreshAuthTokens,
  blacklistToken,
  revokeRefreshToken,
};
