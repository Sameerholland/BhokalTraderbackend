const express = require('express');
const {  GetCourse } = require('../Controller/CourseController');

const router = express.Router();

router.get('/courses', GetCourse)

exports.router  = router;