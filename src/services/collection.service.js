const createCollectionDao = require('../dao/collection.dao');
const collectionDao = createCollectionDao();

const findCollection = async (query) => {
  const results = await collectionDao.findCollection(query);
  return results;
};

module.exports = {
  findCollection,
};
