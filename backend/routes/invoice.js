
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Extract the original file extension
        // const ext = path.extname(file.originalname);
        // // Generate a unique filename based on the original name (without the extension)
        // const uniqueFileName = file.originalname.replace(ext, '') + '-' + Date.now() + ext;
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
});
const router = require('express').Router();
const InvoiceController = require('../controllers/invoice');
const authenticate = require('../middleware/authenticate')

router.route('/csv').get(authenticate, InvoiceController.getCSV);
router.route('/').get(authenticate, InvoiceController.get);
router.route('/:id').get(authenticate, InvoiceController.getById);
router.route('/').post(authenticate, InvoiceController.post);
router.route('/:id').put(authenticate, InvoiceController.put);
router.route('/:id').delete(authenticate, InvoiceController.delete);
router.route('/process-image').post(authenticate, upload.single('imageFile'), InvoiceController.processImage);
router.route('/upload-image').post(authenticate, upload.single('imageFile'), InvoiceController.uploadImage);
module.exports = router;