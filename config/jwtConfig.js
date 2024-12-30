const jwt = require("jsonwebtoken");
require("dotenv").config(); 

// Generate a JWT token
function generateToken(user) {
  // Payload for the token
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  // Generate token
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); 
}

// Verify the JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); 
  } catch (err) {
    return null; 
  }
}
module.exports = {
  generateToken,
  verifyToken,
};
