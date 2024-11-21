const AppError = require('../utils/errors/app-error');
const { ErrorResponse, SuccessResponse } = require('../utils/common/index');
const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services/index');
const validateAuthRequest = (req, res, next) => {
  if (!req.body.email) {
    ErrorResponse.error = new AppError(
      'Email is required',
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.password) {
    ErrorResponse.error = new AppError(
      'Password is required',
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
};
const checkAuth = async (req, res, next) => {
  try {
    const isAuthenticated =await UserService.isAuthenticated(
      req.headers['x-access-token']
    );
    if (isAuthenticated) {
      req.user = isAuthenticated;
      next();
    }
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }
};
module.exports = {
  validateAuthRequest,
  checkAuth
};
