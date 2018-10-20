const redis = require('redis');

const redisClient = redis.createClient(6379, 'redis');

function countAPICalls(req, res, next) {
    const url = req.route.path;
    redisClient.incr(url);
    next();
}

module.exports = countAPICalls;
