const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.verifyToken = async (req, res, next) => {
        req.cookies = JSON.parse(JSON.stringify(req.cookies))
        let token = req.headers.authorization;
        try{
            let data = await jwt.verify(token, process.env.JWT_SECRET);
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