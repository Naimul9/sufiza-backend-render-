// External imports
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate Tokens
function generateTokens(user) {
  // Create Access Token (short lifespan)
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }, // Payload

    ACCESS_TOKEN_SECRET, // Secret key

    {
      expiresIn: "15m", // Expiration time
    }
  );

  // Create Refresh Token (long lifespan)
  const refreshToken = jwt.sign(
    {
      id: user._id,
    }, // Minimal payload

    REFRESH_TOKEN_SECRET, // Secret key

    { expiresIn: "7d" } // Expiration time
  );

  return { accessToken, refreshToken };
}

module.exports = {
  generateTokens,
};
