const User = require("./models/User");
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredient");
const db = require("./db");

Recipe.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Recipe, { foreignKey: "userId" });

Ingredient.belongsToMany(User, { through: "user_ingredient" });
User.belongsToMany(Ingredient, { through: "user_ingredient" });

module.exports = {
  db,
  User,
  Recipe,
  Ingredient,
};
