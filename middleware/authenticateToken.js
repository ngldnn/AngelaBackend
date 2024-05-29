const jwt = require('jsonwebtoken');
const secretKey = 'lorenzo-secret-key';

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token){
        console.log('Token missing from request headers');
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ error: "Forbidden" });
        }

        console.log('Token verified successfully');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
