const httpStatus = require('http-status');
const asyncHandler = require('../../utils/asyncHandler');
const { userService } = require('../../services');
const ApiError = require('../../utils/apiError');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  res.status(200).send(user);
});

const updateMe = asyncHandler(async (req, res) => {
  // logic to update user profile
  res.status(200).send({ message: 'Profile updated (stub)' });
});

module.exports = {
  getMe,
  updateMe,
};
