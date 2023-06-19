const Sequelize = require("sequelize");
const db = require("../db");

const Ingredient = db.define("ingredient", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  timestamps: false,
});

module.exports = Ingredient;
