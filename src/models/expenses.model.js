const { DataTypes } = require('sequelize');
const { options } = require('./options/options');

module.exports = (sequelize) => {
  const expenses = sequelize.define(
    'expenses',
    {
      expenses_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expenses_type: {
        type: DataTypes.STRING(255),
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
      status: {
        type: DataTypes.BOOLEAN,
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

  return expenses;
};
