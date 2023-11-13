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

function createCollectionDao() {
  const superDaoLoans = createSuperDao(loans);
  const superDaoUsers = createSuperDao(users);

  //   async function findInstallmentDetails(payload) {
  //     const { loan_id } = payload;
  //     const options = {
  //       include: [
  //         {
  //           model: users,
  //           attributes: ['username'],
  //         },
  //         {
  //           model: members,
  //           attributes: ['nickname'],
  //         },
  //         {
  //           model: payments,
  //           as: 'loanPayments',
  //           attributes: ['amount', 'type', 'no', 'remark', 'created_at'],
  //         },
  //         {
  //           model: penalties,
  //           as: 'loanPenalties',
  //           attributes: ['no', 'amount', 'remark', 'created_at', 'pay_date'],
  //         },
  //       ],
  //     };

  //     const loan = await superDaoLoans.findOne(options, { where: { loan_id } });
  //     if (loan) {
  //       const results = {
  //         ...loan.toJSON(),
  //         loan_amount: parseFloat(loan.loan_amount),
  //         totalPayments: loan.loanPayments.length,
  //         loanPayments: loan.loanPayments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
  //         loanPenalties: loan.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0),
  //         penalties: loan.loanPenalties.map((item) => {
  //           return {
  //             interest_no: item.no,
  //             installment: item.amount,
  //             type: 'Interest',
  //             date: item.pay_date,
  //             remark: item.remark,
  //           };
  //         }),
  //         payments_loan: loan.loanPayments
  //           .filter((payment) => payment.type === 'LOAN')
  //           .map((item) => {
  //             return {
  //               paidIndex: item.no,
  //               installment: item.amount,
  //               type: 'Loan Paid',
  //               date: item.created_at,
  //               remark: item.remark,
  //             };
  //           }),
  //         payments_penalty: loan.loanPayments
  //           .filter((payment) => payment.type === 'PENALTY')
  //           .map((item) => {
  //             return {
  //               paidIndex: item.no,
  //               installment: item.amount,
  //               type: 'Interest Paid',
  //               date: item.created_at,
  //               remark: item.remark,
  //             };
  //           }),
  //         paidPayments: loan.loanPayments
  //           .filter((payment) => payment.type === 'LOAN')
  //           .reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
  //         paidPenalties: loan.loanPayments
  //           .filter((payment) => payment.type === 'PENALTY')
  //           .reduce((acc, payment) => acc + parseFloat(payment.amount), 0),
  //         loan_info: getLoanInfo(loan),
  //       };

  //       return results;
  //     } else {
  //       throw new ApiError(httpStatus.NOT_FOUND, 'LOAN_NOT_FOUND');
  //     }
  //   }

  function formatDate(date) {
    const dateObject = new Date(date);

    // Extract the date part (year, month, day)
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Month is zero-based, so add 1
    const day = dateObject.getDate();

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    return formattedDate;
  }

  function getLoanInfo(payload, date, user, member, loan_id) {
    const approve_at = payload.approved_at; // "2023-10-17"
    const collection_times = payload.collection_times; // 30
    const collection_per_day = parseFloat(payload.collection_per_day); // "50.00"

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

      if (formatDate(formattedDate) === formatDate(date)) {
        // Add loan information for the current day to the array
        loanInfoArray.push({
          no: loan_id,
          username: user,
          member: member,
          date: formatDate(formattedDate),
          type: 'Loan',
          amount: collection_per_day.toFixed(2),
        });
      }
    }

    return loanInfoArray;
  }

  /**
   * * Get collection details
   * @returns {Promise<results>}
   */
  async function findCollection(payload) {
    const { user_id, role, date } = payload;
    const format_date = new Date(date);

    const options = {
      attributes: ['no', 'full_amount', 'stamp', 'approved_at', 'collection_times', 'collection_per_day'],
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

    const findRelatedUser = await superDaoUsers.findAll({}, { where: { created_by: user_id }, attributes: ['user_id'] });
    const allUsersID = findRelatedUser.flatMap((item) => item.user_id).concat([user_id]);
    const whereCondition =
      role === 'AGENT' ? { created_by: user_id } : role === 'SUPERVISOR' ? { created_by: allUsersID } : {};

    const query = {
      where: {
        ...whereCondition,
        // non_performing: false,
        status: true,
      },
    };

    const loan = await superDaoLoans.findAll(options, query);
    const loanInfo = loan.map((item) => {
      const payment_collected_today = item.loanPayments
        .filter((payment) => formatDate(payment.created_at) === formatDate(format_date))
        .map((payment) => {
          return {
            no: item.no,
            username: item.user.username,
            member: item.member.nickname,
            date: formatDate(payment.created_at),
            type: payment.type === 'LOAN' ? 'Loan paid' : 'Interest paid',
            amount: payment.amount,
          };
        });
      const penalty_collection_today = item.loanPenalties
        .filter((penalty) => formatDate(penalty.pay_date) === formatDate(format_date))
        .map((penalty) => {
          return {
            no: item.no,
            username: item.user.username,
            member: item.member.nickname,
            date: formatDate(penalty.pay_date),
            type: 'Penalty',
            amount: penalty.amount,
          };
        });
      const loanPenalties = item.loanPenalties.reduce((acc, penalty) => acc + parseFloat(penalty.amount), 0);
      const paidPayments = item.loanPayments
        .filter((payment) => payment.type === 'LOAN')
        .reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
      const paidPenalties = item.loanPayments
        .filter((payment) => payment.type === 'PENALTY')
        .reduce((acc, payment) => acc + parseFloat(payment.amount), 0);

      const loan_collection_today = getLoanInfo(item, format_date, item.user.username, item.member.nickname, item.no);

      const totalPaymentAmount = paidPayments + paidPenalties;
      const totalPayableAmount = parseFloat(item.full_amount) + loanPenalties;
      const overDueAmount = totalPaymentAmount - totalPayableAmount;

      const totalCollection = item.collection_times + item.loanPenalties.length;
      const installment = totalCollection;

      return {
        no: item.no,
        username: item.user.username,
        member: item.member.nickname,
        overDueAmount: overDueAmount.toFixed(2),
        installment: installment,
        payment_collection: payment_collected_today,
        collection_today: [...penalty_collection_today, ...loan_collection_today],
      };
    });

    const final = {
      installment_list: [],
      all_payment_today: [],
      all_collection_today: [],
    };

    loanInfo.forEach((result) => {
      const installmentEntry = {
        no: result.no,
        username: result.username,
        member: result.member,
        overDueAmount: result.overDueAmount,
        installment: result.installment,
      };

      final.installment_list.push(installmentEntry);

      if (result.payment_collection && result.payment_collection.length > 0) {
        final.all_payment_today = final.all_payment_today.concat(result.payment_collection);
      }

      if (result.collection_today && result.collection_today.length > 0) {
        final.all_collection_today = final.all_collection_today.concat(result.collection_today);
      }
    });

    return final;
  }

  return {
    findCollection,
  };
}

module.exports = createCollectionDao;
