const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories/index');
const userRepo = new UserRepository();
const AppError = require('../utils/errors/app-error');
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
module.exports = {
  create,
};
