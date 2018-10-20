const GenerateToken = require('../services/jwtSign');

exports.login = async (req, res, next) => {
    // validate login data here
    const username = 'mengna.zhu';

    const token = GenerateToken({username: username});

    return res.status(200).json({data: token, status: 'success', message: 'login success'});
};