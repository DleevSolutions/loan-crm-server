const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const loans = models.loans;
const users = models.users;
const payments = models.payments;
const penalties = models.penalties;
const expenses = models.expenses;

function createReportDao() {
  const superDaoLoans = createSuperDao(loans);
  const superDaoUsers = createSuperDao(users);
  const superDaoExpenses = createSuperDao(expenses);

  async function findLoans(query, status) {
    const options = {
      attributes: ['loan_amount', 'full_amount', 'stamp'],
      include: [
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

    const results = await superDaoLoans.findAll(options, {
      where: {
        ...query,
        ...status,
      },
    });

    const final = results.map((item) => {
      const loanPaymentsSum = item.loanPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2);
      const loanPenaltiesSum = item.loanPenalties.reduce((sum, penalty) => sum + parseFloat(penalty.amount), 0).toFixed(2);

      return {
        loan_amount: item.loan_amount,
        full_amount: item.full_amount,
        stamp: item.stamp,
        loanPayments: loanPaymentsSum,
        loanPenalties: loanPenaltiesSum,
      };
    });

    const summarized = final.reduce(
      (acc, item) => {
        acc.total_loan_amount += parseFloat(item.loan_amount);
        acc.total_full_amount += parseFloat(item.full_amount);
        acc.total_stamp += parseFloat(item.stamp);
        acc.total_payments += parseFloat(item.loanPayments);
        acc.total_penalties += parseFloat(item.loanPenalties);

        return acc;
      },
      {
        total_loan_amount: 0,
        total_full_amount: 0,
        total_stamp: 0,
        total_payments: 0,
        total_penalties: 0,
      }
    );

    return {
      ...summarized,
      total_loan: results.length,
    };
  }

  const allType = ['Balai', 'Gang', 'Medical', 'Petrol', 'Phone', 'Repair/Service', 'Salary', 'Stamp', 'Stationery'];

  /**
   * * Group by expenses type
   */
  async function findExpenses(query) {
    const options = {
      attributes: ['expenses_type', 'amount'],
    };

    const results = await superDaoExpenses.findAll(options, query);
    const final = results.reduce((acc, item) => {
      const type = item.expenses_type;
      const amount = parseFloat(item.amount);

      if (acc[type] === undefined) {
        acc[type] = amount;
      } else {
        acc[type] += amount;
      }

      return acc;
    }, {});

    const data = {};

    // Iterate over allType
    allType.forEach((type) => {
      // Check if the type exists in expenses_data, if yes, use its value, else use 0
      data[type] = final[type] || 0;
    });

    return data;
  }

  /**
   * * Get report
   * @returns {Promise<results>}
   */
  async function findReport(payload) {
    const { user_id, role, start_date, end_date } = payload;
    const format_start_date = new Date(start_date);
    const format_end_date = new Date(end_date);
    format_end_date.setDate(format_end_date.getDate() + 1); // add one day for end date

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const loanQuery = {
      ...whereCondition,
      //* get created_at between the start_date and end_date
      approved_at: {
        [models.Sequelize.Op.between]: [format_start_date, format_end_date],
      },
    };
    const expensesQuery = {
      where: {
        ...whereCondition,
        status: true,
        //* get created_at between the start_date and end_date
        created_at: {
          [models.Sequelize.Op.between]: [format_start_date, format_end_date],
        },
      },
    };

    const allLoans = await findLoans(loanQuery, { status: true });
    const allNonPerformingLoan = await findLoans(loanQuery, { status: false });
    const allExpenses = await findExpenses(expensesQuery);

    return {
      loan_data: allLoans,
      loan_non_performing_data: allNonPerformingLoan,
      expenses_data: allExpenses,
    };
  }

  return {
    findReport,
  };
}

module.exports = createReportDao;
