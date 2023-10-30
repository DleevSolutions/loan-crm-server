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

function createInstallmentDao() {
  const superDaoLoans = createSuperDao(loans);
  const superDaoUsers = createSuperDao(users);

  /**
   * * Get and count installment list
   * * Get and count installment list for particular user with conditions as below
   * ? Search and filter query included here
   * @returns {Promise<results>}
   */
  async function findAllInstallments(payload) {
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

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const query = {
      where: {
        ...whereCondition,
        non_performing: false,
        status: true,
        approved_at: {
          [models.Sequelize.Op.between]: [format_start_date, format_end_date],
        },
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
          loan_no: i,
          date: formattedDate,
          type: 'Loan',
          installment: collection_per_day.toFixed(2),
        });
      }

      return loanInfoArray;
    } else {
      return null;
    }
  }

  async function findInstallmentDetails(payload) {
    const { loan_id } = payload;
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
          attributes: ['amount', 'type', 'no', 'remark', 'created_at'],
        },
        {
          model: penalties,
          as: 'loanPenalties',
          attributes: ['no', 'amount', 'remark', 'created_at', 'pay_date'],
        },
      ],
    };

    const loan = await superDaoLoans.findOne(options, { where: { loan_id } });
    if (loan) {
      const results = {
        ...loan.toJSON(),
        loan_amount: parseFloat(loan.loan_amount),
        totalPayments: loan.loanPayments.length,
        loanPayments: loan.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
        loanPenalties: loan.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
        penalties: loan.loanPenalties.map((item) => {
          return {
            interest_no: item.no,
            installment: item.amount,
            type: 'Interest',
            date: item.pay_date,
            remark: item.remark,
          };
        }),
        payments_loan: loan.loanPayments
          .filter((payment) => payment.type === 'LOAN')
          .map((item) => {
            return {
              paidIndex: item.no,
              installment: item.amount,
              type: 'Loan Paid',
              date: item.created_at,
              remark: item.remark,
            };
          }),
        payments_penalty: loan.loanPayments
          .filter((payment) => payment.type === 'PENALTY')
          .map((item) => {
            return {
              paidIndex: item.no,
              installment: item.amount,
              type: 'Interest Paid',
              date: item.created_at,
              remark: item.remark,
            };
          }),
        paidPayments: loan.loanPayments
          .filter((payment) => payment.type === 'LOAN')
          .reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
        paidPenalties: loan.loanPayments
          .filter((payment) => payment.type === 'PENALTY')
          .reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
        loan_info: getLoanInfo(loan),
      };

      return results;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'LOAN_NOT_FOUND');
    }
  }

  return {
    findAllInstallments,
    findInstallmentDetails,
  };
}

module.exports = createInstallmentDao;
