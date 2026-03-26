const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    message: 'Account created. Please check your email to verify.',
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ user, accessToken });
});

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.json({ message: 'Email verified successfully' });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  const { accessToken, refreshToken } = await authService.refreshTokens(token);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json({ message: 'If the email exists, a reset link has been sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.json({ message: 'Password reset successfully' });
});

module.exports = {
  register,
  login,
  verifyEmail,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
