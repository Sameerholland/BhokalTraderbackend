const express = require('express');
const { subscription } = require('../Controller/SubscribtionController');

const router = express.Router()

router.post('/newsletter', subscription)

exports.router  = router;