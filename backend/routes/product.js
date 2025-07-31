const router = require('express').Router();
const ProductController = require('../controllers/product');
const authenticate = require('../middleware/authenticate')

router.route('/csv/').get(authenticate, ProductController.getCSV);
router.route('/').get(authenticate, ProductController.get);
router.route('/:id').get(authenticate, ProductController.getById);
router.route('/').post(authenticate, ProductController.post);
router.route('/:id').put(authenticate, ProductController.put)
router.route('/:id').delete(authenticate, ProductController.delete);
module.exports = router;