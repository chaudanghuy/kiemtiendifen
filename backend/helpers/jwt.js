const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET_KEY;
    return jwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/articles(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${process.env.API_URL}/users/login`,
            `${process.env.API_URL}/users/register`
        ]
    });
}

module.exports = authJwt;