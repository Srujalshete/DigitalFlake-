const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  // Remove "Bearer " prefix if present
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Store the decoded data in the request object for later use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
