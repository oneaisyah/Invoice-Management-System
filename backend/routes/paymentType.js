const router = require('express').Router();
const PaymentTypeController = require('../controllers/paymentType');
const authenticate = require('../middleware/authenticate')

router.route('/csv/').get(authenticate, PaymentTypeController.getCSV);
router.route('/').get(authenticate, PaymentTypeController.get);
router.route('/:id').get(authenticate, PaymentTypeController.getById);
router.route('/').post(authenticate, PaymentTypeController.post);
router.route('/:id').put(authenticate, PaymentTypeController.put);
router.route('/:id').delete(authenticate, PaymentTypeController.delete);
module.exports = router;