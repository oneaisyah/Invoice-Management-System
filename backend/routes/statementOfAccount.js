const router = require('express').Router();
const StatementOfAccountController = require('../controllers/statementOfAccount');
const authenticate = require('../middleware/authenticate')

router.route('/csv').get(authenticate, StatementOfAccountController.getCSV);
router.route('/').get(authenticate, StatementOfAccountController.get);
router.route('/:id').get(authenticate, StatementOfAccountController.getById);
router.route('/').post(authenticate, StatementOfAccountController.post);
router.route('/:id').put(authenticate, StatementOfAccountController.put);
router.route('/:id').delete(authenticate, StatementOfAccountController.delete);
router.route('/upload-image').post(authenticate, StatementOfAccountController.uploadImage);
module.exports = router;