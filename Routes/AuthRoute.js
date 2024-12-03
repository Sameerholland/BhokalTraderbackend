const express = require('express');
const { createUser, loginuser, checkUser } = require('../Controller/AuthController');
const passport = require('passport');

const router = express.Router();

router.post('/singup', createUser)
.post('/login', passport.authenticate('local'),loginuser)
.get('/check',passport.authenticate('jwt') ,checkUser)

exports.router = router;