const rateLimit = require('express-rate-limit');

// Dynamic rate limiter function
const createRateLimiter = ({ windowMs, max, message }) => {
    return rateLimit({
        windowMs, // Time window in ms
        max, // Max number of requests allowed in the time window
        message: (req, res) => {
            // Calculate how long to wait for the rate limit to reset
            const remainingTime = Math.ceil((res.getHeader('X-RateLimit-Reset') - Date.now()) / 1000); // In seconds
            const minutesLeft = Math.ceil(remainingTime / 60); // Convert to minutes
            return message || `Too many requests, please try again after ${minutesLeft} minute(s).`;
        },
        standardHeaders: true, // Includes rate limit info in response headers
        legacyHeaders: false, // Disable X-RateLimit-* headers
    });
};

module.exports = createRateLimiter;