const { UserController } = require('../../controllers/index');
const router = require('express').Router(); 
router.post('/', UserController.createUser);
module.exports = router;