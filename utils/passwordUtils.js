const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
// Check if password meets the requirements returns true or false.
// 8 long, 1 Special character, 1 Uppercase letter.
const validatePassword = (password) => {
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const uppercaseRegex = /[A-Z]/;

  const hasSpecialChar = specialCharsRegex.test(password);
  const isAtLeast8Long = password.length >= 8;
  const hasUppercase = uppercaseRegex.test(password);

  return hasSpecialChar && isAtLeast8Long && hasUppercase;
};

// Hashes the password and returns the hashed password.
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

// Verifies password and returns true or false.
const verifyPassword = async (password, user) => {
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

module.exports = {
  validatePassword,
  hashPassword,
  verifyPassword,
};
