'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
const { SALT_ROUNDS } = require('../config/server-config');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, { through: 'User_Roles', as: 'role' });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 15],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  User.beforeCreate(function encryptPassword(user) {
    user.password = bcrypt.hashSync(user.password, +SALT_ROUNDS);
  });
  return User;
};
//To run a migration : 