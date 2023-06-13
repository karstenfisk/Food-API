const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
// Generate token for the user.
const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
};
const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = decodedToken;
  return id;
};

module.exports = { generateToken, verifyToken };
