const express = require("express");
const router = express.Router();
const { User } = require("../db_config");
const {
  verifyPassword,
  hashPassword,
  validatePassword,
} = require("../utils/passwordUtils");

// POST /api/auth/register - Register a new user.
router.post("/register", async (req, res, next) => {
  try {
    // Body should contain rememberMe, username, password, email, and name the others are optional (phone number).
    const { username, password, email } = req.body;
    const finalUsername = username ? username.toLowerCase() : null;
    const finalEmail = email ? email.toLowerCase() : null;

    // Check if password meets the requirements.
    if (!validatePassword(password)) {
      return res
        .status(422)
        .json({ error: "Password does not meet the requirements." });
    }
    // Check if username is already taken.
    const user = await User.findOne({ where: { username: finalUsername } });
    if (user) {
      return res
        .status(422)
        .json({ error: "The username provided is already in use." });
    }
    // Check if email is already taken.
    const emailTaken = await User.findOne({ where: { email: finalEmail } });
    if (emailTaken) {
      return res
        .status(422)
        .json({ error: "The email provided is already in use." });
    }
    // Hash the password.
    const hashedPassword = await hashPassword(password);
    // Create the user.
    const newUser = await User.create({
      username: finalUsername,
      password: hashedPassword,
      email: finalEmail,
    });

    const getUser = await User.findByPk(newUser.id);
    // Send the user back.
    res.status(200).json(getUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    // Take in username and password from req.body
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({
      where: { username: username.toLowerCase() },
    });

    // If user is not found, return error
    if (!user) {
      return res
        .status(404)
        .json({ error: "Username or password is incorrect" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user);

    // If password is not valid, return error
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Username or password is incorrect" });
    }
    console.log(user);

    res.json(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
