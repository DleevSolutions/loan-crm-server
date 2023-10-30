const createAuthDao = require('../dao/auth.dao');
const authDao = createAuthDao();

const login = async (body) => {
  const results = await authDao.login(body);
  return results;
};

module.exports = {
  login,
};
