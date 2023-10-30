const createSuperDao = require('./index');
const models = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { v4 } = require('uuid');

const penalties = models.penalties;
const users = models.users;
const loans = models.loans;
const members = models.members;

function createPaymentsDao() {
  const superDaoPenalties = createSuperDao(penalties);

  /**
   * * Count total penalties made
   * @returns {Promise<results>}
   */
  async function countCreatedPenalties(loan_id) {
    const results = await superDaoPenalties.count({ loan_id: loan_id });
    return results;
  }

  /**
   * * Create penalty
   * @type {MASTER, SUPERVISOR, AGENT}
   * * Find largest no in penalties for particular loan, add 1 after the largest no
   * @returns {Promise<results>}
   */
  async function createPenalty(payload) {
    const {
      body,
      query: { user_id, loan_id },
    } = payload;

    const no = await countCreatedPenalties(loan_id);
    const data = {
      ...body,
      loan_id: loan_id,
      penalty_id: v4(),
      no: no + 1,
      created_by: user_id,
    };
    const results = await superDaoPenalties.create(data);
    return results;
  }

  /**
   * * Delete penalty
   * ! Currently not working
   * @type SUPERVISOR AGENT
   * @returns {Promise<results>}
   */
  async function deletePenalty(query) {
    const { payment_id } = query;

    const results = await superDaoPenalties.remove({ payment_id });
    return results;
  }

  return {
    createPenalty,
    deletePenalty,
  };
}

module.exports = createPaymentsDao;
