const User = require("./models/User");
const Recipe = require("./models/Recipe");
const db = require("./db");

Recipe.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Recipe, { foreignKey: "userId" });

module.exports = {
  db,
  User,
  Recipe,
};
