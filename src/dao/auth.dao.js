const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const users = models.users;

function createAuthDao() {
  const superDaoUsers = createSuperDao(users);

  /**
   * * Get user list
   * @returns {Promise<results>}
   */
  async function login(body) {
    const { username, password } = body;
    const results = await superDaoUsers.findOne({}, { where: { username: username } });
    if (!results) throw new ApiError(httpStatus.UNAUTHORIZED, 'USER_NOT_FOUND');
    const isPasswordMatch = results.password === password;
    if (!isPasswordMatch) throw new ApiError(httpStatus.UNAUTHORIZED, 'WRONG_PASSWORD');
    if (!results.status) throw new ApiError(httpStatus.UNAUTHORIZED, 'ACCOUNT_DEACTIVED');

    return results;
  }

  return {
    login,
  };
}

module.exports = createAuthDao;
