var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('<p>Hello user: </p>' + req.user.username)
});

module.exports = router;
