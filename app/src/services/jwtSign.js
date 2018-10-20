
const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');

/**
 * Create token
 * @param username
 */
function jwtSign(username) {
    return jwt.sign(username, credentials.secret, {
        expiresIn: 86400 * 30 // expires in 1 month
    });
}

module.exports = jwtSign;
