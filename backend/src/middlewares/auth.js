const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { userService } = require('../services');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Please authenticate');
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Please authenticate');
  }
});

module.exports = auth;
