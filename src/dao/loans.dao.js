const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const loans = models.loans;
const users = models.users;
const payments = models.payments;
const penalties = models.penalties;
const members = models.members;

function createLoansDao() {
  const superDaoLoans = createSuperDao(loans);
  const superDaoUsers = createSuperDao(users);

  function getLoanInfo(payload) {
    const approve_at = payload.approved_at; // "2023-10-17"
    const collection_times = payload.collection_times; // 30
    const collection_per_day = parseFloat(payload.collection_per_day); // "50.00"

    if (approve_at) {
      // Parse the start date into a Date object
      const startDate = new Date(approve_at);

      // Initialize an array to store the loan information
      const loanInfoArray = [];

      // Loop through the collection times and generate loan information for each day
      for (let i = 1; i <= collection_times; i++) {
        // Calculate the date for each day
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i - 1);

        // Format the date as "YYYY-MM-DD"
        const formattedDate = currentDate;

        // Add loan information for the current day to the array
        loanInfoArray.push({
          no: i,
          date: formattedDate,
          type: 'Loan',
          amount: collection_per_day.toFixed(2), // Ensure the amount has two decimal places
        });
      }

      return loanInfoArray;
    } else {
      return null;
    }
  }

  /**
   * * Get and count loan list
   * * Get and count loan list for particular user with conditions as below
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllLoans(payload) {
    const { user_id, role, search_text = '', row_per_page = 10, page = 1 } = payload;

    // const row_per_page_int = parseInt(row_per_page);
    // const page_int = parseInt(page);

    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
        {
          model: members,
          attributes: ['nickname', 'member_id'],
        },
        {
          model: payments,
          as: 'loanPayments',
          attributes: ['amount'],
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['no', 'amount', 'created_at'],
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
      },
    };

    const results = await superDaoLoans.findAll(options, query);

    const calculatedData = results.map((item) => {
      return {
        ...item.toJSON(),
        loan_amount: parseFloat(item.loan_amount),
        totalPayments: item.loanPayments.length,
        loanPayments: item.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
        loanPenalties: item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
        penalties: item.loanPenalties,
        loan_info: getLoanInfo(item),
      };
    });

    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: calculatedData,
    };
    return final;
  }

  /**
   * * Get and count non-performing loan list
   * * Get and count non-performing loan list for particular user with conditions as below
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllNonPerformingLoans(payload) {
    const { user_id, role } = payload;

    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
        {
          model: members,
          attributes: ['nickname', 'member_id'],
        },
        {
          model: payments,
          as: 'loanPayments',
          attributes: ['amount'],
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['amount'],
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
        non_performing: true,
        status: true,
      },
    };

    const results = await superDaoLoans.findAll(options, query);
    const calculatedData = results
      .filter((item) => {
        const loanPayments = item.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
        const loanPenalties = item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0);
        const balance = parseFloat(loanPayments) - (parseFloat(item.full_amount) + parseFloat(loanPenalties));
        if (parseFloat(balance) >= 0) {
          return false;
        } else {
          return true;
        }
      })
      .map((item) => {
        const loanPayments = item.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
        const loanPenalties = item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0);
        return {
          ...item.toJSON(),
          totalPenalty: item.loanPenalties.length,
          loan_amount: parseFloat(item.loan_amount),
          paidLoan: paidLoan,
          paidPenalty: paidPenalty,
          penalties: item.loanPenalties.sort((a, b) => new Date(a.pay_date) - new Date(b.pay_date)),
          totalPayments: item.loanPayments.length,
          loanPayments: loanPayments,
          loanPenalties: loanPenalties,
        };
      });

    // Get only incomplete loan

    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: calculatedData,
    };
    return final;
  }
  // async function findAllNonPerformingLoans(payload) {
  //   const { user_id, role, start_date, end_date } = payload;
  //   const format_start_date = new Date(start_date);
  //   const format_end_date = new Date(end_date);
  //   format_end_date.setDate(format_end_date.getDate() + 1); // add one day for end date

  //   const options = {
  //     include: [
  //       {
  //         model: users,
  //         attributes: ['username'],
  //       },
  //       {
  //         model: members,
  //         attributes: ['nickname'],
  //       },
  //       {
  //         model: payments,
  //         as: 'loanPayments',
  //         attributes: ['amount'],
  //       },
  //       {
  //         model: penalties,
  //         as: 'loanPenalties',
  //         attributes: ['no', 'amount', 'created_at'],
  //       },
  //     ],
  //   };

  //   const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
  //   const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
  //   const whereCondition =
  //     role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

  //   const query = {
  //     where: {
  //       ...whereCondition,
  //       non_performing: true,
  //       approved_at: {
  //         [models.Sequelize.Op.between]: [format_start_date, format_end_date],
  //       },
  //     },
  //   };

  //   const results = await superDaoLoans.findAll(options, query);

  //   const calculatedData = results.map((item) => {
  //     return {
  //       ...item.toJSON(),
  //       loan_amount: parseFloat(item.loan_amount),
  //       totalPayments: item.loanPayments.length,
  //       loanPayments: item.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
  //       loanPenalties: item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
  //       penalties: item.loanPenalties,
  //       loan_info: getLoanInfo(item),
  //     };
  //   });

  //   const final = {
  //     draw: 1,
  //     recordsTotal: results.length,
  //     recordsFiltered: results.length,
  //     data: calculatedData,
  //   };
  //   return final;
  // }

  async function findLoanHistory(payload) {
    const { user_id, role, member_id, non_performing } = payload;

    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
        {
          model: members,
          attributes: ['nickname', 'member_id'],
        },
        {
          model: payments,
          as: 'loanPayments',
          attributes: ['amount'],
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['no', 'amount', 'created_at'],
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
        member_id: member_id,
        non_performing: non_performing === 'true' ? true : false,
      },
    };

    const results = await superDaoLoans.findAll(options, query);

    const calculatedData = results.map((item) => {
      return {
        ...item.toJSON(),
        loan_amount: parseFloat(item.loan_amount),
        totalPayments: item.loanPayments.length,
        loanPayments: item.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
        loanPenalties: item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
        penalties: item.loanPenalties,
        loan_info: getLoanInfo(item),
      };
    });

    const final = {
      draw: 1,
      recordsTotal: results.length,
      recordsFiltered: results.length,
      data: calculatedData,
    };
    return final;
  }

  async function findLoan(loan_id) {
    const options = {
      include: [
        {
          model: users,
          attributes: ['username'],
        },
        {
          model: members,
          attributes: ['nickname'],
        },
        {
          model: payments,
          as: 'loanPayments',
          attributes: ['amount'],
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['no', 'amount', 'created_at'],
        },
      ],
    };

    const query = {
      where: { loan_id: loan_id },
    };

    const results = await superDaoLoans.findOne(options, query);
    const calculatedData = {
      ...results.toJSON(),
      loan_amount: parseFloat(results.loan_amount),
      totalPayments: results.loanPayments.length,
      loanPayments: results.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
      loanPenalties: results.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
      penalties: results.loanPenalties,
      loan_info: getLoanInfo(results),
    };
    return calculatedData;
  }

  /**
   * * Count total loan for user
   * @returns {Promise<results>}
   */
  async function countCreatedLoans(user_id) {
    const results = await superDaoLoans.count({ created_by: user_id });
    return results;
  }

  /**
   * * Create loan
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in loans for particular creator(user), add 1 after the largest no
   * @returns {Promise<results>}
   */
  async function createLoan(payload) {
    const {
      body,
      query: { user_id },
    } = payload;
    const no = await countCreatedLoans(user_id);
    const user = await superDaoUsers.findByPk(user_id);
    const data = {
      ...body,
      loan_id: v4(),
      no: no + 1,
      status: user.role === 'AGENT' ? false : true,
      created_by: user_id,
    };

    await superDaoLoans.create(data);
    const results = await findLoan(data.loan_id);

    return results;
  }

  /**
   * * Approve loan
   * ! Update user account balance
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function approveLoan(payload) {
    const {
      body,
      query: { loan_id },
    } = payload;

    const data = {
      ...body,
    };

    await superDaoLoans.update(data, { loan_id });
    const results = await findLoan(loan_id);
    return results;
  }

  /**
   * * Update loan
   * * Same usage for loan approval
   * ! Update user account balance
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function updateLoan(payload) {
    const {
      body,
      query: { loan_id },
    } = payload;

    await superDaoLoans.update(body, { loan_id });
    const results = await findLoan(loan_id);
    return results;
  }

  /**
   * * Delete loan
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function deleteLoan(query) {
    const { loan_id } = query;

    const results = await superDaoLoans.remove({ loan_id });
    return results;
  }

  return {
    findAllLoans,
    findAllNonPerformingLoans,
    findLoanHistory,
    createLoan,
    approveLoan,
    updateLoan,
    deleteLoan,
  };
}

module.exports = createLoansDao;
