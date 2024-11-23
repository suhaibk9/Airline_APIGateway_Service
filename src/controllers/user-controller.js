const { UserService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

const SignUp = async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    SuccessResponse.data = user;
    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (err) {
    ErrorResponse.error = err;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};
const SignIn = async (req, res) => {
  try {
    const user = await UserService.signIn(req.body);
    SuccessResponse.data = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    console.log('Error in Controller', err);
    ErrorResponse.error = err;
    throw new AppError('Cannot sign in', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
const addRoleToUser = async (req, res) => {
  try {
    const user = await UserService.addRoleToUser({
      userId: req.body.userId,
      role: req.body.role,
    });
    SuccessResponse.data = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (err) {
    console.log('Error in Controller', err);
    ErrorResponse.error = err;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};
module.exports = {
  SignUp,
  SignIn,
  addRoleToUser,
};
