const people      = require('./routes/people');
const messages    = require('./routes/messages');
const user        = require('./routes/user');
const verifyToken = require('./services/jwtVerify');
const countAPIs   = require('./services/redisService');

module.exports = (app) => {
    app.get('/check', messages.checkStatus);

    app.post(
        '/import',
        countAPIs,
        verifyToken,
        people.import
    );

    app.get(
        '/tags',
        countAPIs,
        verifyToken,
        people.getTags
    );

    app.get(
        '/person/:id',
        countAPIs,
        verifyToken,
        people.getPersonById
    );

    app.get(
        '/people',
        countAPIs,
        verifyToken,
        people.getPeopleByGender
    );

    app.post(
        '/login',
        countAPIs,
        user.login
    );
};
