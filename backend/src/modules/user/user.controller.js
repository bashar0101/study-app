const asyncHandler = require('../../utils/asyncHandler');
const { userService } = require('../../services');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  res.json({ user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json({ user });
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json({ message: 'Password changed successfully' });
});

module.exports = { getMe, updateMe, changePassword };
