const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller.js')
router.get('/', Controller.index);
router.get('/login', Controller.login);
router.get('/register', Controller.register);
module.exports = router;