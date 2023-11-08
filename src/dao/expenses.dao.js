const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const expenses = models.expenses;
const users = models.users;

function createExpensesDao() {
  const superDaoExpenses = createSuperDao(expenses);
  const superDaoUsers = createSuperDao(users);

  /**
   * * Get and count expenses list
   * * Get and count expenses list for particular user with conditions as below
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllExpenses(payload) {
    const { user_id, role, start_date, end_date } = payload;
    const format_start_date = new Date(start_date);
    const format_end_date = new Date(end_date);
    format_end_date.setDate(format_end_date.getDate() + 1); // add one day for end date

    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
      ],
    };

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const query = {
      where: {
        ...whereCondition,
        created_at: {
          [models.Sequelize.Op.between]: [format_start_date, format_end_date],
        },
      },
      // limit: parseInt(row_per_page_int),
      // offset: (page_int - 1) * row_per_page_int,
      // order: [['created_at', 'DESC']],
    };

    const results = await superDaoExpenses.findAll(options, query);
    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: results,
    };
    return final;
  }

  async function findExpenses(expenses_id) {
    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
      ],
    };
    const query = {
      where: { expenses_id: expenses_id },
    };

    const results = await superDaoExpenses.findOne(options, query);
    return results;
  }

  /**
   * * Count total expenses for user
   * @returns {Promise<results>}
   */
  async function countCreatedExpenses(user_id) {
    const results = await superDaoExpenses.count({ created_by: user_id });
    return results;
  }

  /**
   * * Create expenses
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in expenses for particular creator(user), add 1 after the largest no
   * @returns {Promise<results>}
   */
  async function createExpenses(payload) {
    const {
      body,
      query: { user_id },
    } = payload;
    const no = await countCreatedExpenses(user_id);
    const user = await superDaoUsers.findByPk(user_id);
    const data = {
      ...body,
      expenses_id: v4(),
      no: no + 1,
      status: true,
      created_by: user_id,
    };

    await superDaoExpenses.create(data);
    const results = await findExpenses(data.expenses_id);
    return results;
  }

  /**
   * * Update expenses
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function updateExpenses(payload) {
    const {
      body,
      query: { expenses_id },
    } = payload;

    await superDaoExpenses.update(body, { expenses_id });
    const results = await findExpenses(expenses_id);
    return results;
  }

  /**
   * * Delete expenses
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function deleteExpenses(query) {
    const { expenses_id, role } = query;
    const expenses = await findExpenses(expenses_id);
    if (!expenses) throw new ApiError(httpStatus.NOT_FOUND, 'DATA_DELETED');

    const currentDate = new Date();
    const createdDate = new Date(expenses.created_at);

    // Remove the time part for comparison
    const currentDateWithoutTime = new Date(currentDate);
    currentDateWithoutTime.setHours(0, 0, 0, 0);

    const createdDateWithoutTime = new Date(createdDate);
    createdDateWithoutTime.setHours(0, 0, 0, 0);
    // Check if currentDateWithoutTime is on or before createdDateWithoutTime
    const isDeletable = currentDateWithoutTime <= createdDateWithoutTime;
    if (!isDeletable) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'EXPENSES_CLOSED');

    const results = await superDaoExpenses.remove({ expenses_id });
    return results;
  }

  return {
    findAllExpenses,
    createExpenses,
    updateExpenses,
    deleteExpenses,
  };
}

module.exports = createExpensesDao;
