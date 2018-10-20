exports.checkStatus = (req, res, next) => {
    res.send({
        serverName: 'my-app-server',
        status: 'ok'
    });
};

