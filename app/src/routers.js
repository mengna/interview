const people      = require('./routes/people');
const messages    = require('./routes/messages');
const user        = require('./routes/user');
const verifyToken = require('./services/jwtVerify');
const countAPIs   = require('./services/redisService');

module.exports = (app) => {
    app.get('/myapp/check', messages.checkStatus);

    app.post(
        '/myapp/v1.0/import',
        countAPIs,
        verifyToken,
        people.import
    );

    app.get(
        '/myapp/v1.0/tags',
        countAPIs,
        verifyToken,
        people.getTags
    );

    app.get(
        '/myapp/v1.0/person/:id',
        countAPIs,
        verifyToken,
        people.getPersonById
    );

    app.get(
        '/myapp/v1.0/people',
        countAPIs,
        verifyToken,
        people.getPeopleByGender
    );

    app.post(
        '/myapp/v1.0/login',
        countAPIs,
        user.login
    );
};
