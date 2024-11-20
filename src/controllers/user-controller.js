const { UserService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const createUser = async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    res.status(StatusCodes.CREATED).json(user);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json(err.message);
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Cannot create user');
    }
  }
};

module.exports = {
  createUser,
};
