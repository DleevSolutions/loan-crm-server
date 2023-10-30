module.exports.ErrorCode = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    description: 'User not exist',
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    description: 'Password incorrect',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    description: 'Please login to continue',
  },
  ACCOUNT_DEACTIVED: {
    code: 'ACCOUNT_DEACTIVED',
    description: 'Account deactivated, please contact admin',
  },
  USER_EXISTED: {
    code: 'USER_EXISTED',
    description: 'Username already in used',
  },
  MEMBER_EXISTED: {
    code: 'MEMBER_EXISTED',
    description: 'Member nickname already in used',
  },
  DATA_DELETED: {
    code: 'DATA_DELETED',
    description: 'Data deleted, please refresh to get latest',
  },
  EXPENSES_CLOSED: {
    code: 'EXPENSES_CLOSED',
    description: 'Expenses already confirmed, not allow to delete',
  },
  PAYMENT_CLOSED: {
    code: 'PAYMENT_CLOSED',
    description: 'Payment already confirmed, not allow to delete',
  },
  LOAN_NOT_FOUND: {
    code: 'LOAN_NOT_FOUND',
    description: 'LOAN_NOT_FOUND',
  },
  // Sequelize
  users_SequelizeForeignKeyConstraintError: {
    code: 'users_SequelizeForeignKeyConstraintError',
    description: 'User is in used and cannot be deleted',
  },
  members_SequelizeForeignKeyConstraintError: {
    code: 'members_SequelizeForeignKeyConstraintError',
    description: 'Unable to delete! Member has active loan',
  },
  LOAN_IS_NOT_CLEAR: {
    code: 'LOAN_IS_NOT_CLEAR',
    description: 'Loan is not clear',
  },
};
