const router = require('express').Router();
const loginFunction = require('../controllers/authenticate');

router.route('/').post(loginFunction.checkTokenValidity);
router.route('/login').post(loginFunction.login);

module.exports = router;