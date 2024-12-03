const express = require('express');
const { QueryForm } = require('../Controller/ContactController');

const router = express.Router();

router.post('/query',QueryForm)

exports.router = router;