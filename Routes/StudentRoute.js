const express = require('express');
const { getAllStudents } = require('../Controller/StudentController');
const router = express.Router();

router.post('/All',getAllStudents)

exports.router  = router;