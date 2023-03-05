const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const Player = require('../models/mysqlModel/player.model');
const Account = require('../models/mysqlModel/user.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.findOne({ user: userBody.user });
  const checkPlayer = await User.findOne({
    $or: [{ player1: userBody.user }, { player2: userBody.user }, { player3: userBody.user }],
  });
  if (user || checkPlayer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'username already taken');
  }
  const newUser = new User();
  newUser.user = userBody.user;
  newUser.password = userBody.password;
  newUser.role = 'user';
  // newUser.player1 = userBody.user;
  newUser.status = 'pending';
  await newUser.save();
  return newUser;
};

/**
 * Active user
 * @param {number} userId
 * @returns {Promise<User>}
 */
const activeUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.status = 'active';
  await user.save();
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const account = await Account.findAll();
  // logger.info(account);
  const player = await Player.findAll();
  const users = await User.paginate(filter, options);
  return { player, users, accounts: account };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by user
 * @param {string} user
 * @returns {Promise<User>}
 */
const getUserByUsername = async (user) => {
  return User.findOne({ user });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  activeUser,
  getUserById,
  getUserByUsername,
  updateUserById,
  deleteUserById,
};
