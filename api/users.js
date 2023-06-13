const express = require("express");
const router = express.Router();
const { User } = require("../db_config");
const { verifyToken } = require("../utils/tokenUtils");

router.get("/me", async (req, res, next) => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7); // Remove the "Bearer " prefix
      // Verify the token and get the user ID
      const id = verifyToken(token);
      // Find the user in the database using the ID
      const user = await User.findByPk(id);

      if (user) {
        // User found, return the user data
        res.json(user);
      } else {
        // User not found
        res.status(404).json({ error: "User not found" });
      }
    } else {
      // Invalid or missing token
      res.status(401).json({ error: "Invalid or missing token" });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
