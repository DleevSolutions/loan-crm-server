const createExpensesDao = require('../dao/expenses.dao');
const expensesDao = createExpensesDao();

const findAllExpenses = async (query) => {
  const results = await expensesDao.findAllExpenses(query);
  return results;
};

const createExpenses = async (payload) => {
  const results = await expensesDao.createExpenses(payload);
  return results;
};

const updateExpenses = async (payload) => {
  const results = await expensesDao.updateExpenses(payload);
  return results;
};

const deleteExpenses = async (query) => {
  const results = await expensesDao.deleteExpenses(query);
  return results;
};

module.exports = {
  findAllExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
