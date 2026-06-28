const memoryStore = {};

const rateLimiter = (limit = 120, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const now = Date.now();

    if (!memoryStore[ip]) {
      memoryStore[ip] = [];
    }

    // Filter out requests older than windowMs
    memoryStore[ip] = memoryStore[ip].filter(timestamp => now - timestamp < windowMs);

    if (memoryStore[ip].length >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP address, please try again after 15 minutes.'
      });
    }

    memoryStore[ip].push(now);
    next();
  };
};

module.exports = rateLimiter;
