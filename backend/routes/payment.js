const router = require('express').Router();
const PaymentController = require('../controllers/payment');

const authenticate = require('../middleware/authenticate')

router.route('/csv/').get(authenticate, PaymentController.getCSV);
router.route('/').get(authenticate, PaymentController.get);
router.route('/:id').get(authenticate, PaymentController.getById);
router.route('/').post(authenticate, PaymentController.post);
router.route('/:id').put(authenticate, PaymentController.put);
router.route('/:id').delete(authenticate, PaymentController.delete);
module.exports = router;