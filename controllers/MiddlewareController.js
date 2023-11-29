const jwt = require('jsonwebtoken');

class MiddlewareController {

    // verify token
    verifyToken (req, res, next) {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, user) => {
                if (error) {
                    return res.status(401).json({ error: 'Invalid token!' });
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json("You're not authenticated!");
        }
    }

}

module.exports = new MiddlewareController;
