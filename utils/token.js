// External imports
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate Tokens
function generateTokens(user) {
  // Create Access Token (short lifespan)
  const accessToken = jwt.sign(
    {
      email: user.email,
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
      email: user.email,
      role: user.role,
    }, // Payload

    REFRESH_TOKEN_SECRET, // Secret key

    { expiresIn: "7d" } // Expiration time
  );

  return { accessToken, refreshToken };
}

// Verify Refresh Token
function verifyRefreshToken(token) {
  try {
    const userInfo = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return userInfo;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateTokens,
  verifyRefreshToken,
};
