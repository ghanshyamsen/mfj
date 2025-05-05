/**
 * Authenticates middleware
*/
const jwt = require('jsonwebtoken');

const handle = async (req, res, next) => {

    // Middleware logic goes here
    const token = req.header('Authorization');

    if (!token) return res.status(401).send('Access Denied');

    try {

        const getToken = token.split(' ')[1];

        const verified = jwt.verify(getToken, process.env.JWT_SECRET_KEY);
        req.user = verified;
    } catch (err) {
        return res.status(400).send({message: err.message});
    }

    return next();
};

module.exports = { handle };