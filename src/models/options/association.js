module.exports = (db) => {
  const { users, members, loans, payments, penalties, expenses } = db;

  users.belongsTo(users, { foreignKey: 'created_by', as: 'upline', onDelete: 'RESTRICT' });
  users.hasMany(users, { foreignKey: 'created_by', as: 'createdUsers', onDelete: 'RESTRICT' });

  members.belongsTo(users, { foreignKey: 'created_by', onDelete: 'RESTRICT' });
  users.hasMany(members, { foreignKey: 'created_by', onDelete: 'RESTRICT' });

  loans.belongsTo(members, { foreignKey: 'member_id', onDelete: 'CASCADE' });
  members.hasMany(loans, { foreignKey: 'member_id', onDelete: 'CASCADE' });
  loans.belongsTo(users, { foreignKey: 'created_by', onDelete: 'CASCADE' });
  users.hasMany(loans, { foreignKey: 'created_by', onDelete: 'CASCADE' });

  payments.belongsTo(loans, { foreignKey: 'loan_id', onDelete: 'CASCADE' });
  loans.hasMany(payments, { foreignKey: 'loan_id', as: 'loanPayments', onDelete: 'CASCADE' });
  payments.belongsTo(users, { foreignKey: 'created_by', onDelete: 'CASCADE' });
  users.hasMany(payments, { foreignKey: 'created_by', onDelete: 'CASCADE' });

  penalties.belongsTo(loans, { foreignKey: 'loan_id', onDelete: 'CASCADE' });
  loans.hasMany(penalties, { foreignKey: 'loan_id', as: 'loanPenalties', onDelete: 'CASCADE' });
  penalties.belongsTo(users, { foreignKey: 'created_by', onDelete: 'CASCADE' });
  users.hasMany(penalties, { foreignKey: 'created_by', onDelete: 'CASCADE' });

  expenses.belongsTo(users, { foreignKey: 'created_by', onDelete: 'RESTRICT' });
  users.hasMany(expenses, { foreignKey: 'created_by', onDelete: 'RESTRICT' });
};
