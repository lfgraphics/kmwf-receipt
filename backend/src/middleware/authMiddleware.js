const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Extract the token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ title: "Unauthorized", message: "No token provided" });
            }

            const token = authHeader.split(" ")[1];

            // Verify the token
            const decoded = jwt.verify(token, SECRET_KEY);

            // Check if the user's role is allowed (if roles are provided)
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ title: "Forbidden", message: "Access denied" });
            }

            // Attach the user information to the request object for downstream use
            req.user = decoded;

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(401).json({ title: "Unauthorized", message: "Invalid token" });
        }
    };
};

module.exports = authMiddleware;
