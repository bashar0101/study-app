const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/env');
const { userService } = require('./index');

/**
 * Generate token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} secret
 * @returns {string}
 */
const generateToken = (userId, expires, secret = config.jwt.accessSecret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token (if we had a token model, for Refresh Tokens)
 * For now, we'll just return the tokens.
 */

/**
 * Verify token and return user
 * @param {string} token
 * @param {string} secret
 * @returns {Promise<User>}
 */
const verifyToken = async (token, secret = config.jwt.accessSecret) => {
  const payload = jwt.verify(token, secret);
  return userService.getUserById(payload.sub);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(parseInt(config.jwt.accessExpiration), 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, config.jwt.accessSecret);

  // For 1.0, we just return the access token. 
  // Refresh tokens can be added later with a Token model.
  
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
