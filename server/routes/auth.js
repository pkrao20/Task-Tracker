const express = require("express");
const router = express.Router();
const { Register,Login,emailVerification } = require("../controller/user");

router.post('/register',Register);
router.get('/login',Login);
// router.post('/verify',emailVerification);
module.exports = router;