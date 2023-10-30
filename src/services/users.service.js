const createUsersDao = require('../dao/users.dao');
const usersDao = createUsersDao();

const findAllUsers = async (query) => {
  const results = await usersDao.findAllUsers(query);
  return results;
};

const createUser = async (payload) => {
  const results = await usersDao.createUser(payload);
  return results;
};

const updateUser = async (payload) => {
  const results = await usersDao.updateUser(payload);
  return results;
};

const deleteUser = async (query) => {
  const results = await usersDao.deleteUser(query);
  return results;
};

module.exports = {
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
