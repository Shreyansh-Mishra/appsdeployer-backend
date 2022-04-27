var express = require('express');
var router = express.Router();
var User = require('../models/user');
var {verifyToken} = require('../middleware/auth');
/* GET users listing. */
router.post('/update', verifyToken, async (req, res)=> {
  try{
      console.log(req.body);
      let username = req.body.username;
      let password = req.body.password;
      let user = await User.findOne({_id: req.user.id});
      user.username = username;
      user.password = password;
      await user.save();
      console.log("saved");
      res.json({
        "success": true
      })
    }
    catch(err){
      res.json({
        "success": false,
        "error": err
      })
    }
});

module.exports = router;
