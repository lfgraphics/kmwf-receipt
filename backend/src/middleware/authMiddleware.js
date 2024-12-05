const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Extract the token from cookies or Authorization header
            const token = req.cookies.authToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
            if (!token) {
                return res.status(401).json({ title: "Unauthorized", message: "No token provided" });
            }

            const decoded = jwt.verify(token, SECRET_KEY);

            // Check if the user's role is allowed
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ title: "Forbidden", message: "Access denied" });
            }

            // Attach the user information to the request object
            req.user = decoded;

            next();
        } catch (error) {
            res.status(401).json({ title: "Unauthorized", message: "Invalid token" });
        }
    };
};

module.exports = authMiddleware;