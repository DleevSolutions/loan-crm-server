const createLoansDao = require('../dao/loans.dao');
const loansDao = createLoansDao();

const findAllLoans = async (query) => {
  const results = await loansDao.findAllLoans(query);
  return results;
};

const findAllArchiveLoans = async (query) => {
  const results = await loansDao.findAllNonPerformingLoans(query);
  return results;
};

const findLoanHistory = async (query) => {
  const results = await loansDao.findLoanHistory(query);
  return results;
};

const createLoan = async (payload) => {
  const results = await loansDao.createLoan(payload);
  return results;
};

const updateLoan = async (payload) => {
  const results = await loansDao.updateLoan(payload);
  return results;
};

const deleteLoan = async (query) => {
  const results = await loansDao.deleteLoan(query);
  return results;
};

module.exports = {
  findAllLoans,
  findAllArchiveLoans,
  findLoanHistory,
  createLoan,
  updateLoan,
  deleteLoan,
};
