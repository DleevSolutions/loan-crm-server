const createPenaltiesDao = require('../dao/penalty.dao');
const penaltiesDao = createPenaltiesDao();

const createPenalty = async (payload) => {
  const results = await penaltiesDao.createPenalty(payload);
  return results;
};

const deletePenalty = async (query) => {
  const results = await penaltiesDao.deletePenalty(query);
  return results;
};

module.exports = {
  createPenalty,
  deletePenalty,
};
