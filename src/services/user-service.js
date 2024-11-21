const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories/index');
const userRepo = new UserRepository();
const AppError = require('../utils/errors/app-error');
const { Auth } = require('../utils/common');
const bcrypt = require('bcrypt');
const create = async (data) => {
  try {
    const user = await userRepo.create(data);
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
module.exports = {
  create,
  signIn,
  isAuthenticated,
};
