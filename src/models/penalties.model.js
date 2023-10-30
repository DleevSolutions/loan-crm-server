const { DataTypes } = require('sequelize');
const { options } = require('./options/options');

module.exports = (sequelize) => {
  const penalties = sequelize.define(
    'penalties',
    {
      penalty_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      loan_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'loans',
          key: 'loan_id',
        },
      },
      no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      pay_date: {
        type: DataTypes.DATE,
        allowNull: false,
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

  return penalties;
};
