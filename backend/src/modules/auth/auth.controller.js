const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../../utils/asyncHandler');
const { userService, emailService, tokenService } = require('../../services');
const ApiError = require('../../utils/apiError');

const register = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  
  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, user.verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  // Remove sensitive fields from response
  delete user.verificationToken;

  res.status(httpStatus.status.CREATED).send({
    message: 'User registered successfully. Please check your email to verify your account.',
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Incorrect email or password');
  }
  
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(httpStatus.status.BAD_REQUEST, 'Verification token is required');
  }
  await userService.verifyUserEmail(token);
  res.send({ message: 'Email verified successfully! You can now log in.' });
});

module.exports = {
  register,
  login,
  verifyEmail,
};
