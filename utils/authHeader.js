const { User } = require("../db_config");
const { verifyToken } = require("../utils/tokenUtils");

const validateAuth = async (header) => {
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7); // Remove the "Bearer " prefix
      // Verify the token and get the user ID
      const id = verifyToken(token);
      // Find the user in the database using the ID
      const user = await User.findByPk(id);

      if (user) {
        // User found, return the user data
        return user;
      } else {
        // User not found
        return { error: "User not found" };
      }
    } else {
      // Invalid or missing token
      return { error: "Invalid or missing token" };
    }
  } catch (e) {
    return { error: "Could not validate user" };
  }
};

module.exports = validateAuth;
