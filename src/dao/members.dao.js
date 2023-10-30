const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const users = models.users;
const members = models.members;
const loans = models.loans;
const penalties = models.penalties;
const payments = models.payments;

function createMembersDao() {
  const superDaoUsers = createSuperDao(users);
  const superDaoMembers = createSuperDao(members);
  const superDaoLoans = createSuperDao(loans);

  /**
   * * Get and count member list
   * * Get and count member list for particular member with conditions as below
   * * MASTER will see all member of MASTER, SUPERVISOR and AGENT
   * * SUPERVISOR will see all member of it's SUPERVISOR, AGENT
   * * AGENT will see it's member
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllMembers(payload) {
    const { user_id, role, search_text = '', row_per_page = 10, page = 1 } = payload;

    // const row_per_page_int = parseInt(row_per_page);
    // const page_int = parseInt(page);

    const options = {
      include: {
        model: users,
        attributes: ['username'],
      },
    };

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const query = {
      where: {
        ...whereCondition,
        // [models.Sequelize.Op.or]: [
        //   { no: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { nickname: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { full_name: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { mykad_number: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { phone_1: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { phone_2: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { town: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        //   { state: { [models.Sequelize.Op.like]: `%${search_text}%` } },
        // ],
      },
      // limit: parseInt(row_per_page_int),
      // offset: (page_int - 1) * row_per_page_int,
      // order: [['created_at', 'DESC']],
    };

    const results = await superDaoMembers.findAll(options, query);
    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: results,
    };
    return final;
  }

  async function findMember(member_id) {
    const options = {
      include: {
        model: users,
        attributes: ['username'],
      },
    };
    const query = {
      where: { member_id: member_id },
    };

    const results = await superDaoMembers.findOne(options, query);
    return results;
  }

  /**
   * * Count total member created by current user
   * @returns {Promise<results>}
   */
  async function countCreatedMember(user_id) {
    const results = await superDaoMembers.count({ created_by: user_id });
    return results;
  }

  /**
   * * Create member
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in members for particular creator(user), add 1 after the largest no
   * @returns {Promise<results>}
   */
  async function createMember(payload) {
    const {
      body,
      query: { user_id },
    } = payload;
    const isMemberExisted = await superDaoMembers.findOne({}, { where: { nickname: body.nickname.trim() } });
    if (isMemberExisted) throw new ApiError(httpStatus.CONFLICT, 'MEMBER_EXISTED');

    const no = await countCreatedMember(user_id);
    const data = {
      ...body,
      member_id: v4(),
      no: no + 1,
      created_by: user_id,
    };

    await superDaoMembers.create(data);
    const results = await findMember(data.member_id);
    return results;
  }

  /**
   * * Update member
   * @returns {Promise<results>}
   */
  async function updateMember(payload) {
    const {
      body,
      query: { member_id },
    } = payload;

    const isMemberExisted = await superDaoMembers.findOne({}, { where: { nickname: body.nickname.trim() } });
    const isCurrentUserName = isMemberExisted.nickname.trim() === body.nickname.trim();
    if (isMemberExisted && !isCurrentUserName) throw new ApiError(httpStatus.CONFLICT, 'MEMBER_EXISTED');

    await superDaoMembers.update(body, { member_id });
    const results = await findMember(member_id);
    return results;
  }

  async function checkLoanBalance(member_id) {
    const options = {
      include: {
        model: loans,
        attributes: ['full_amount'],
        where: { status: true },
        include: [
          {
            model: penalties,
            attributes: ['amount'],
            as: 'loanPenalties',
          },
          {
            model: payments,
            attributes: ['amount'],
            as: 'loanPayments',
          },
        ],
      },
    };
    const query = {
      where: { member_id: member_id },
    };

    const results = await superDaoMembers.findOne(options, query);
    if (!results) return true;

    // Calculate totalLoanPenalties and totalLoanPayments for each loan using reduce
    const loansWithTotals = results.loans.map((loan) => {
      const { loanPenalties, loanPayments } = loan;

      const totalLoanPenalties = (loanPenalties || []).reduce((sum, penalty) => sum + parseFloat(penalty.amount), 0);

      const totalLoanPayments = (loanPayments || []).reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      return {
        balance: parseFloat(loan.full_amount) + totalLoanPenalties - totalLoanPayments,
      };
    });

    const isAllClear = loansWithTotals.every((item) => item.balance <= 0);

    return isAllClear;
  }

  /**
   * * Delete member
   * @returns {Promise<results>}
   */
  async function deleteMember(query) {
    const { member_id } = query;
    const isAllClear = await checkLoanBalance(member_id);
    if (!isAllClear) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'LOAN_IS_NOT_CLEAR');
    const results = await superDaoMembers.remove({ member_id });
    return results;
  }

  return {
    findAllMembers,
    createMember,
    updateMember,
    deleteMember,
  };
}

module.exports = createMembersDao;
