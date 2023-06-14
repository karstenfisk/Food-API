const Sequelize = require("sequelize");
const db = require("../db");

const Recipe = db.define("recipe", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false,
  },
  instructions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false,
  },
  protein: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fats: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  carbohydrates: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  calories: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Recipe;
