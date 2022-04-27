const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.verifyToken = async (req, res, next) => {
        let token = req.headers.authorization;
        console.log(token);
        try{
            let data = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(data);
            req.user = {id:data.id}
            next();
        }
        catch{
            res.json({
                "success": false,
                "error":"Invalid Token!"
            });
        }
}