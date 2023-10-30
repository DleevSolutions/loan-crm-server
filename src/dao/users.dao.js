const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const users = models.users;
const loans = models.loans;
const penalties = models.penalties;
const payments = models.payments;
const members = models.members;

function createUsersDao() {
  const superDaoUsers = createSuperDao(users);
  const superDaoLoans = createSuperDao(loans);
  const superDaoPayments = createSuperDao(payments);

  /**
   * * Get and count user list
   * * Get and count user list for particular user with conditions as below
   * * user list created by the user if role = SUPERVISOR, all user list if role = MASTER
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */

  // const row_per_page_int = parseInt(row_per_page);
  // const page_int = parseInt(page);

  // [models.Sequelize.Op.or]: [
  //   { no: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  //   { username: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  //   { phone_no: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  //   { account_name: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  //   { account_no: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  //   { role: { [models.Sequelize.Op.like]: `%${search_text}%` } },
  // ],

  async function findAllUsers(payload) {
    const { user_id, role, search_text = '', row_per_page = 10, page = 1 } = payload;

    const options = {
      include: [
        {
          model: users,
          as: 'upline',
          attributes: ['username'],
        },
        {
          model: members,
          attributes: ['member_id'],
          include: {
            model: loans,
            attributes: ['full_amount'],
            where: { status: true },
            include: [
              {
                model: penalties,
                as: 'loanPenalties',
                attributes: ['amount'],
              },
              {
                model: payments,
                as: 'loanPayments',
                attributes: ['amount'],
              },
            ],
          },
        },
      ],
    };

    const whereQuery =
      role === 'MASTER'
        ? { role: { [models.Sequelize.Op.not]: 'master' } }
        : {
            created_by: user_id,
            [models.Sequelize.Op.and]: {
              user_id: { [models.Sequelize.Op.not]: user_id },
            },
          };
    const query = {
      where: {
        ...whereQuery,
      },
    };

    const results = await superDaoUsers.findAll(options, query);

    const calculatedResults = results.map((item) => {
      const userTotalLoanAmount = item.members.reduce((sum, member) => {
        return sum + member.loans.reduce((loanSum, loan) => loanSum + parseFloat(loan.full_amount), 0);
      }, 0);

      const userTotalPenaltiesAmount = item.members.reduce((sum, member) => {
        return (
          sum +
          member.loans.reduce((loanSum, loan) => {
            return loanSum + loan.loanPenalties.reduce((paymentSum, payment) => paymentSum + parseFloat(payment.amount), 0);
          }, 0)
        );
      }, 0);

      const userTotalPaidAmount = item.members.reduce((sum, member) => {
        return (
          sum +
          member.loans.reduce((loanSum, loan) => {
            return loanSum + loan.loanPayments.reduce((paymentSum, payment) => paymentSum + parseFloat(payment.amount), 0);
          }, 0)
        );
      }, 0);

      return {
        ...item.toJSON(),
        account_balance: userTotalPaidAmount - (userTotalLoanAmount + userTotalPenaltiesAmount),
      };
    });

    const final = {
      draw: 1,
      recordsTotal: calculatedResults.length,
      recordsFiltered: calculatedResults.length,
      data: calculatedResults,
    };
    return final;
  }

  async function findUser(user_id) {
    const options = {
      include: {
        model: users,
        as: 'upline',
        attributes: ['username'],
      },
    };
    const query = {
      where: { user_id: user_id },
    };

    const results = await superDaoUsers.findOne(options, query);
    return results;
  }

  /**
   * * Count total user for user
   * @returns {Promise<results>}
   */
  async function countCreatedUser(user_id) {
    const results = await superDaoUsers.count({ created_by: user_id });
    return results;
  }

  /**
   * * Create user
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in users for particular creator(user), add 1 after the largest no
   * * Unable for duplicate username
   * @returns {Promise<results>}
   */
  async function createUser(payload) {
    const {
      body,
      query: { user_id },
    } = payload;
    const isUserExisted = await superDaoUsers.findOne({}, { where: { username: body.username.trim() } });
    if (isUserExisted) throw new ApiError(httpStatus.CONFLICT, 'USER_EXISTED');
    const no = await countCreatedUser(user_id);
    const data = {
      ...body,
      user_id: v4(),
      no: no + 1,
      status: true,
      created_by: user_id,
    };

    await superDaoUsers.create(data);
    const results = await findUser(data.user_id);
    return results;
  }

  /**
   * * Update user
   * ! Do not allowed to update username
   * @returns {Promise<results>}
   */
  async function updateUser(payload) {
    const {
      body,
      query: { user_id },
    } = payload;

    await superDaoUsers.update(body, { user_id });
    const results = await findUser(user_id);
    return results;
  }

  /**
   * * Delete user
   * @returns {Promise<results>}
   */
  async function deleteUser(query) {
    const { user_id } = query;

    const results = await superDaoUsers.remove({ user_id });
    return results;
  }

  return {
    findAllUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

module.exports = createUsersDao;
