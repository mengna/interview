const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');

/**
 * Verify Token
 */
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, credentials.secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        }

        /* if everything good, save to request for use in other routes */
        req.auth = decoded;
        next();
    });
}

module.exports = verifyToken;
