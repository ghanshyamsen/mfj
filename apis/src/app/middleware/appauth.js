/**
 * Authenticates middleware
*/
const jwt = require('jsonwebtoken');
const UserModel = require("../../models/user");
const handle = async (req, res, next) => {
    // Middleware logic goes here
    const token = req.header('Authorization');

    if (!token) return res.status(401).send('Access Denied');

    try {

        const getToken = token.split(' ')[1];
        const verified = jwt.verify(getToken, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] });

        if(verified){
            const user = await UserModel.findById(verified.userId);

            if(user){


                if(user && user.user_type ==='subuser' && req.baseUrl !== "/app/chat") {
                    req.user = {userId: user.admin_id};
                }else{
                    req.user = verified;
                }
            }else{
                //return res.status(200).json({status:false, message: 'Invalid user request!'});
                req.user = verified;
            }

        }else{
            return res.status(200).json({status:false, message: 'Invalid token.'});
        }

    } catch (err) {
        return res.status(400).send({message: err.message});
    }

    return next();
};

module.exports = { handle };