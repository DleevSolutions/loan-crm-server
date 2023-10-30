const createInstallmentDao = require('../dao/installment.dao');
const installmentsDao = createInstallmentDao();

const findAllInstallments = async (query) => {
  const results = await installmentsDao.findAllInstallments(query);
  return results;
};

const findInstallmentDetails = async (query) => {
  const results = await installmentsDao.findInstallmentDetails(query);
  return results;
};

module.exports = {
  findAllInstallments,
  findInstallmentDetails,
};
