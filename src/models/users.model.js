const { DataTypes } = require('sequelize');
const { options } = require('./options/options');

module.exports = (sequelize) => {
  const users = sequelize.define(
    'users',
    {
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      account_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      account_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      role: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'AGENT',
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
    },
    options
  );

  return users;
};
