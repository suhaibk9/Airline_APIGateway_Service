const { StatusCodes } = require('http-status-codes');
const { UserRepository, RoleRepository } = require('../repositories/index');
const userRepo = new UserRepository();
const roleRepo = new RoleRepository();
const { ENUMS } = require('../utils/common/index');
const { USER_ROLES } = ENUMS;
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES;
const AppError = require('../utils/errors/app-error');
const { Auth } = require('../utils/common');

const bcrypt = require('bcrypt');
const create = async (data) => {
  try {
    const user = await userRepo.create(data);
    const role = await roleRepo.getRoleByName(CUSTOMER);
    console.log('USER', user);
    console.log('ROLE', role);
    user.addRole(role);

    return user;
  } catch (err) {
    if (
      err.name === 'SequelizeUniqueConstraintError' ||
      err.name === 'SequelizeValidationError'
    ) {
      let explanation = [];
      err.errors.forEach((error) => {
        explanation.push(error.message);
      });
      throw new AppError(explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    throw new AppError('Cannot create user', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
const signIn = async (data) => {
  try {
    const user = await userRepo.getUserByEmail(data.email);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    const isPasswordCorrect = await Auth.checkPassword(
      data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new AppError('Password is incorrect', StatusCodes.UNAUTHORIZED);
    }
    const jwt = Auth.createToken({
      id: user.id,
      email: user.email,
    });
    return jwt;
  } catch (err) {
    console.log('ERROR IN SERVICE', err);
    throw new AppError('Cannot sign in', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
const isAuthenticated = async (token) => {
  try {
    if (!token) {
      throw new AppError('Token is required', StatusCodes.UNAUTHORIZED);
    }
    const user = Auth.verifyToken(token);
    const response = await userRepo.get(user.id);
    if (!response) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (err) {
    if (err.name === 'JsonWebTokenError')
      throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED);
    if (err.name === 'TokenExpiredError')
      throw new AppError('Token has expired', StatusCodes.UNAUTHORIZED);
    throw new AppError('Cannot verify token', StatusCodes.UNAUTHORIZED);
  }
};
const addRoleToUser = async (data) => {
  console.log('DATA in Service', data);
  try {
    const role = await roleRepo.getRoleByName(data.role);
    const user = await userRepo.get(data.userId);
    if (!role) {
      throw new AppError('Role not found', StatusCodes.NOT_FOUND);
    }
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    user.addRole(role);
    return user;
  } catch (err) {
    console.log('ERROR IN SERVICE', err);
    throw new AppError(
      'Cannot add role to user',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
const isAdmin = async (id) => {
  try {
    const user = await userRepo.get(id);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
    const role = await roleRepo.getRoleByName(ADMIN);
    if (!role) throw new AppError('Role not found', StatusCodes.NOT_FOUND);
    const isUserAdmin = await user.hasRole(role);
    return isUserAdmin;
  } catch (err) {
    console.log('ERROR IN SERVICE', err);
    throw new AppError(
      'Cannot verify user role',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
module.exports = {
  create,
  signIn,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
};
