const bcrypt = require('bcryptjs');
const { userService, tokenService, emailService } = require('../../services');
const ApiError = require('../../utils/apiError');
const config = require('../../config/env');

const register = async ({ name, email, password }) => {
  const user = await userService.createUser({ name, email, password });

  try {
    await emailService.sendVerificationEmail(user.email, user.verificationToken);
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

const login = async ({ email, password }) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, 'Please verify your email first');
  }

  const { accessToken, refreshToken } = await tokenService.generateAuthTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (token) => {
  await userService.verifyUserEmail(token);
};

const refreshTokens = async (refreshToken) => {
  return tokenService.refreshAuthTokens(refreshToken);
};

const logout = async (userId) => {
  await tokenService.revokeRefreshToken(userId);
};

const forgotPassword = async (email) => {
  const result = await userService.generateResetToken(email);
  if (!result) return; // Don't reveal if user exists

  const resetUrl = `${config.frontendUrl}/reset-password?token=${result.resetToken}`;
  try {
    await emailService.sendEmail(
      result.user.email,
      'Reset your password',
      `Reset your password by clicking: ${resetUrl}`,
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #999;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>`
    );
  } catch (err) {
    console.error('Failed to send reset email:', err.message);
  }
};

const resetPassword = async (token, password) => {
  await userService.resetPassword(token, password);
};

module.exports = {
  register,
  login,
  verifyEmail,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
};
