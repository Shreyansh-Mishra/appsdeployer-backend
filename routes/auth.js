var express = require('express');
var router = express.Router();
var {verifyToken} = require('../middleware/auth');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

router.post('/signup', async (req, res) => {
    if(req.user){
        res.json({
            "success":false,
            "error": "Already logged in!"
        })
    }
    else{
        let check_user = await User.findOne({"email": req.body.email});
        let check_user2 = await User.findOne({"username":req.body.username});
        if (check_user == null && check_user2==null) {
            let {username, email, password} = req.body;   
            //encrypt userdata with jwt
            let verifytoken = jwt.sign(req.body, process.env.VERIFICATION_JWT_SECRET);
            //use nodemailer to send verification email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email',
                html: `<h1>Please verify your email by clicking on this One Time Link <a href="${process.env.backend}auth/verify/${verifytoken}">Click here</a>.</h1>
                <br>If this was not you, please ignore this email.`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            console.log(verifytoken);
            res.json({
                "success": true
            })
        }
        else {
            res.json({
                "success": false,
                "error": "Already Registered!"
            })
        }

    }
});

router.get('/verify/:token', async (req, res) => {
    let {token} = req.params;
    try {
        let decoded = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET);
        console.log(decoded);
        let user = await new User(decoded);
        console.log(user);
        await user.save();
        //send a html response to the user stating that the email has been verified
        res.send(`<h1>Your account has been verified!</h1>
        <p>Click <a href="${process.env.frontend}"/login>here</a> to login.</p>`);
    }
    catch (e) {
        res.json({
            "success": false,
            "msg": "Invalid Token!",
            "error": e
        })
    }
});

router.post('/login', async (req, res)=>{
    let {username,password} = req.body;
    let user = await User.findOne({username,password})
    if(user!=null){
        let token = jwt.sign({"id":user._id},process.env.JWT_SECRET);
        res.json({
            "success": true,
            token
        })
    }
    else{
        res.json({
            "success":false,
            "error": "Incorrect Credentials"
        })
    }
})


module.exports = router;