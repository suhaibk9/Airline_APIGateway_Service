const { UserController } = require('../../controllers/index');
const router = require('express').Router();
const { AuthRequestMiddleWare } = require('../../middlewares/index');
const { Auth } = require('../../utils/common');
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
router.post(
  '/role',
  AuthRequestMiddleWare.checkAuth,
  AuthRequestMiddleWare.isAdmin,
  UserController.addRoleToUser
);
module.exports = router;
