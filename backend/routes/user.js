const router = require('express').Router();
const UserController = require('../controllers/user');
const authenticate = require('../middleware/authenticate');
const {createAccountCheck, updateAccountCheck} = require('../middleware/modifyAccountChecks');

router.route('/').get(authenticate, UserController.get);
router.route('/:id').get(authenticate, UserController.getByID);
router.route('/').post(createAccountCheck, UserController.post);
router.route('/:id').put(authenticate, updateAccountCheck, UserController.put);
router.route('/:id').delete(authenticate, UserController.delete);

module.exports = router;