/* eslint-disable prefer-destructuring */
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Account = require('../models/mysqlModel/user.model');
const { User } = require('../models');

const checkDbGame = async (user, password) => {
  const account = await Account.findOne({
    where: {
      user,
      pass: password,
    },
  });
  if (!account) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
  }
  const userDb = await User.findOne({
    user: account.user,
  });
  const player = JSON.parse(account.char);
  if (userDb) {
    userDb.player1 = player[0];
    userDb.player2 = player[1];
    userDb.player3 = player[2];
    userDb.password = password;
    await userDb.save();
  } else {
    return await User.create({
      user,
      password,
      player1: player[0],
      player2: player[1],
      player3: player[2],
      role: 'user',
    });
  }

  return userDb;
};

/**
 * Login with username and password
 * @param {string} user
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (user, password) => {
  const userDb = await User.findOne({
    user,
    password,
  });
  if (!userDb) {
    return await checkDbGame(user, password);
  }
  const account = await Account.findOne({
    where: {
      user,
    },
  });
  const player = JSON.parse(account.char);
  if (player.length > 0) {
    userDb.player1 = player[0];
    userDb.player2 = player[1];
    userDb.player3 = player[2];
  }
  userDb.password = password;
  await userDb.save();
  return userDb;
  // }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

module.exports = {
  loginUserWithUsernameAndPassword,
  logout,
  refreshAuth,
  resetPassword,
};
