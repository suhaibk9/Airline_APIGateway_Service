const { UserController } = require('../../controllers/index');
const router = require('express').Router();
const { AuthRequestMiddleWare } = require('../../middlewares/index');
router.post(
  '/signup',
  AuthRequestMiddleWare.validateAuthRequest,
  UserController.SignUp
);
router.post(
  '/signin',
  AuthRequestMiddleWare.validateAuthRequest,
  UserController.SignIn
);
module.exports = router;
