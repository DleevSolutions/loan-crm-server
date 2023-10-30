const { DataTypes } = require('sequelize');
const { options } = require('./options/options');

module.exports = (sequelize) => {
  const loans = sequelize.define(
    'loans',
    {
      loan_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      member_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'members',
          key: 'member_id',
        },
      },
      no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stamp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      loan_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      full_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      collection_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      collection_times: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      installment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      interest_collection_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      interest_collection_times: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      non_performing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      created_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
    },
    options
  );

  return loans;
};
