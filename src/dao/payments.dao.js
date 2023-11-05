const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const payments = models.payments;
const users = models.users;
const loans = models.loans;
const members = models.members;

function createPaymentsDao() {
  const superDaoPayments = createSuperDao(payments);
  const superDaoUsers = createSuperDao(users);

  /**
   * * Get and count payment list
   * * Get and count payment list for particular user with conditions as below
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllPayments(payload) {
    const { user_id, role, start_date, end_date } = payload;
    const format_start_date = new Date(start_date);
    const format_end_date = new Date(end_date);
    format_end_date.setDate(format_end_date.getDate() + 1); // add one day for end date

    // const row_per_page_int = parseInt(row_per_page);
    // const page_int = parseInt(page);

    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
        {
          model: loans,
          include: [
            {
              model: members,
              attributes: ['nickname'],
            },
            {
              model: users,
              attributes: ['username'],
            },
          ],
        },
      ],
    };

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    // * Search between date and sort ASC
    const query = {
      where: {
        ...whereCondition,
        created_at: {
          [models.Sequelize.Op.between]: [format_start_date, format_end_date],
        },
      },
    };

    const results = await superDaoPayments.findAll(options, query);
    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: results,
    };
    return final;
  }

  /**
   * * Count total payment made
   * @returns {Promise<results>}
   */
  async function countCreatedPayment(loan_id, type) {
    const results = await superDaoPayments.count({ loan_id: loan_id, type });
    return results;
  }

  /**
   * * Create payment
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in payments for particular loan, add 1 after the largest no
   * ! Update user account balance
   * @returns {Promise<results>}
   */
  async function createPayment(payload) {
    const {
      body,
      query: { user_id, loan_id },
    } = payload;

    const no = await countCreatedPayment(loan_id, body.type);
    const data = {
      ...body,
      loan_id: loan_id,
      payment_id: v4(),
      no: no + 1,
      created_by: user_id,
    };
    const results = await superDaoPayments.create(data);
    return results;
  }

  /**
   * * Update payment
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function updatePayment(payload) {
    const {
      body,
      query: { payment_id },
    } = payload;

    const results = await superDaoPayments.update(body, { payment_id });
    return results;
  }

  async function findPayment(payment_id) {
    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
      ],
    };
    const query = {
      where: { payment_id: payment_id },
    };

    const results = await superDaoPayments.findOne(options, query);
    return results;
  }

  /**
   * * Delete payments
   * ! Not allowed to delete if created_at > (after) 12:00a.m every day
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function deletePayment(query) {
    const { payment_id, role } = query;
    const payment = await findPayment(payment_id);
    if (!payment) throw new ApiError(httpStatus.NOT_FOUND, 'DATA_DELETED');

    const currentDate = new Date();
    const createdDate = new Date(payment.created_at);

    // Remove the time part for comparison
    const currentDateWithoutTime = new Date(currentDate);
    currentDateWithoutTime.setHours(0, 0, 0, 0);

    const createdDateWithoutTime = new Date(createdDate);
    createdDateWithoutTime.setHours(0, 0, 0, 0);
    // Check if currentDateWithoutTime is on or before createdDateWithoutTime
    const isDeletable = currentDateWithoutTime <= createdDateWithoutTime;
    if (!isDeletable) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'PAYMENT_CLOSED');

    const results = await superDaoPayments.remove({ payment_id });
    return results;
  }

  return {
    findAllPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };
}

module.exports = createPaymentsDao;
