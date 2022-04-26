var express = require('express');
var router = express.Router();
var user = require('../models/user');
/* GET users listing. */
router.get('/update', function(req, res) {
  if(req.user){
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let user = User.findOne({"username": req.user.username});
    user.username = username;
    user.email = email;
    user.password = password;
    user.save();
  }
});

module.exports = router;
