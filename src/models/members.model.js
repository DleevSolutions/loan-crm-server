const { DataTypes } = require('sequelize');
const { options } = require('./options/options');

module.exports = (sequelize) => {
  const members = sequelize.define(
    'members',
    {
      member_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      mykad_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      phone_1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      phone_2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      address_1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      address_2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      address_3: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      postcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      town: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Malaysia',
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

  return members;
};
