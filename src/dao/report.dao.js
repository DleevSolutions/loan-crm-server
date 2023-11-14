const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const loans = models.loans;
const users = models.users;
const members = models.members;
const payments = models.payments;
const penalties = models.penalties;
const expenses = models.expenses;

function createReportDao() {
  const superDaoLoans = createSuperDao(loans);
  const superDaoPayments = createSuperDao(payments);
  const superDaoUsers = createSuperDao(users);
  const superDaoExpenses = createSuperDao(expenses);

  async function findLoans(query) {
    const options = {
      attributes: [
        'loan_id',
        'no',
        'loan_amount',
        'full_amount',
        'collection_per_day',
        'collection_times',
        'created_by',
        'stamp',
        'deposit',
      ],
      include: [
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
          attributes: ['amount'],
        },
      ],
    };

    const results = await superDaoLoans.findAll(options, {
      where: {
        ...query,
      },
    });

    const final = results.map((item) => {
      return {
        customer: item.member.nickname,
        loan: item.no,
        collection_per_day: item.collection_per_day,
        installment: item.loan_amount,
        received: 0,
        stamp: item.stamp,
        type: 'Loan',
      };
    });

    return final;
  }

  const allType = [
    'LoanDepositRefund',
    'Balai',
    'Gang',
    'Medical',
    'Petro',
    'Phone',
    'Repair/Service',
    'Salary',
    'StampRefund',
    'Stationery',
  ];

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

  async function findPayments(query, start_date, end_date) {
    const options = {
      include: [
        {
          model: members,
          attributes: ['nickname'],
        },
        {
          model: payments,
          as: 'loanPayments',
          attributes: ['amount', 'type'],
          where: {
            created_at: {
              [models.Sequelize.Op.between]: [start_date, end_date],
            },
          },
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['amount'],
        },
      ],
    };

    const results = await superDaoLoans.findAll(options, {
      attributes: ['loan_id', 'no', 'collection_per_day', 'collection_times', 'created_by'],
      where: {
        ...query,
      },
    });

    function settlePenalties(paidPenalty, penalties) {
      let penaltiesSettled = 0;
      let remainingPenalty = parseFloat(paidPenalty);

      for (const penalty of penalties) {
        const penaltyAmount = parseFloat(penalty.amount);

        if (remainingPenalty >= penaltyAmount) {
          remainingPenalty -= penaltyAmount;
          penaltiesSettled++;
        } else {
          break; // Stop iterating if the remaining penalty is not enough to cover the current penalty
        }
      }

      return penaltiesSettled;
    }

    const loanIDs = results.map((item) => {
      return item.loan_id;
    });

    const allPayments = await superDaoPayments.findAll(
      {},
      {
        attributes: ['loan_id', 'amount', 'type'],
        where: {
          loan_id: loanIDs,
        },
      }
    );

    const final = results.map((item) => {
      const paymentLoan = allPayments
        .filter((payment) => payment.type === 'LOAN' && payment.loan_id === item.loan_id)
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
        .toFixed(2);
      const paymentPenalty = allPayments
        .filter((payment) => payment.type === 'PENALTY' && payment.loan_id === item.loan_id)
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
        .toFixed(2);

      const paidLoan = parseFloat(paymentLoan) / parseFloat(item.collection_per_day);
      const paidPenalty = settlePenalties(paymentPenalty, item.loanPenalties);

      const totalPaidPeriod = parseInt(paidLoan) + parseInt(paidPenalty);
      const totalPayablePeriod = parseFloat(item.loanPenalties.length) + parseFloat(item.collection_times);

      return {
        allPayments: allPayments,
        customer: item.member.nickname,
        loan: item.no,
        collection_per_day: item.collection_per_day,
        installment: `${totalPaidPeriod}/${totalPayablePeriod}`,
        received: item.loanPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2),
        stamp: 0,
        type: 'Payment',
      };
    });

    return final;
  }

  async function findAllUsers(payload) {
    const { user_id, role } = payload;

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const query = {
      attributes: ['user_id', 'username'],
      where: {
        ...whereCondition,
      },
    };

    const results = await superDaoUsers.findAll({}, query);
    return results;
  }

  /**
   * * Get report
   * @returns {Promise<results>}
   */
  async function findReport(payload) {
    const { user_id, role, start_date, end_date, selected_user = 'na' } = payload;
    const format_start_date = new Date(start_date);
    const format_end_date = new Date(end_date);
    format_end_date.setDate(format_end_date.getDate() + 1); // add one day for end date

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};
    const formatCondition =
      selected_user === 'na' || selected_user === 'all' ? whereCondition : { created_by: selected_user };

    const loanQuery = {
      ...formatCondition,
      //* get created_at between the start_date and end_date
      approved_at: {
        [models.Sequelize.Op.between]: [format_start_date, format_end_date],
      },
    };

    const paymentQuery = {
      ...formatCondition,
    };

    const expensesQuery = {
      where: {
        ...formatCondition,
        status: true,
        //* get created_at between the start_date and end_date
        created_at: {
          [models.Sequelize.Op.between]: [format_start_date, format_end_date],
        },
      },
    };

    const allLoans = await findLoans(loanQuery);
    const allPayments = await findPayments(paymentQuery, format_start_date, format_end_date);
    const allExpenses = await findExpenses(expensesQuery);
    const allUsers = await findAllUsers(payload);

    return {
      loan_data: [...allLoans, ...allPayments],
      expenses_data: allExpenses,
      allUsers: allUsers,
    };
  }

  return {
    findReport,
  };
}

module.exports = createReportDao;
