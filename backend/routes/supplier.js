const router = require('express').Router();
const SupplierController = require('../controllers/supplier');
const authenticate = require('../middleware/authenticate')

router.route('/csv/').get(authenticate, SupplierController.getCSV);
router.route('/').get(authenticate, SupplierController.get);
router.route('/:id').get(authenticate, SupplierController.getById);
router.route('/').post(authenticate, SupplierController.post);
router.route('/:id').put(authenticate, SupplierController.put)
router.route('/:id').delete(authenticate, SupplierController.delete);
module.exports = router;