const createPaymentsDao = require('../dao/payments.dao');
const paymentsDao = createPaymentsDao();

const findAllPayments = async (query) => {
  const results = await paymentsDao.findAllPayments(query);
  return results;
};

const createPayment = async (payload) => {
  const results = await paymentsDao.createPayment(payload);
  return results;
};

const updatePayment = async (payload) => {
  const results = await paymentsDao.updatePayment(payload);
  return results;
};

const deletePayment = async (query) => {
  const results = await paymentsDao.deletePayment(query);
  return results;
};

module.exports = {
  findAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
};
