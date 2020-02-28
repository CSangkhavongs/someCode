var express = require('express');
var router = express.Router();

const Auth = require('../app/authentification');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
    Auth.register(req, res);
});

router.post('/login', function(req, res, next) {
   Auth.login(req, res, next);
});

module.exports = router;
