const express = require("express");
const router = express.Router();

const { Ingredient, User } = require("../db_config");
const validateAuth = require("../utils/authHeader");

//GET api/meals/ingredients - Get all ingredients by user.

router.get("/", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const user = await validateAuth(authHeader);
    if (user.error) {
      return res.status(401).json({ error: "Could not validate user" });
    }
    const ingredients = await user.getIngredients();

    // If user has no ingredients return an empty array
    if (!ingredients) {
      return res.json([]);
    }

    const ingredientNames = ingredients.map((ingredient) => ingredient.name);

    res.json(ingredientNames);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing ingredient name" });
    }
    const lowerCaseName = name.toLowerCase();
    const authHeader = req.headers.authorization;
    const user = await validateAuth(authHeader);

    if (user.error) {
      return res.status(401).json({ error: "Could not validate user" });
    }

    let ingredient = await Ingredient.findOne({
      where: { name: lowerCaseName },
    });

    if (!ingredient) {
      ingredient = await Ingredient.create({ name: lowerCaseName });
    }
    await user.addIngredient(ingredient);

    res.status(201).json({ name: ingredient.name });
  } catch (e) {
    next(e);
  }
});

router.delete("/:name", async (req, res, next) => {
  try {
    const name = req.params.name.toLowerCase();
    const authHeader = req.headers.authorization;
    const user = await validateAuth(authHeader);

    if (user.error) {
      return res.status(401).json({ error: "Could not validate user" });
    }

    const ingredient = await Ingredient.findOne({ where: { name } });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    await user.removeIngredient(ingredient);

    const ingredients = await user.getIngredients();

    if (!ingredients) {
      return res.json([]);
    }

    const ingredientNames = ingredients.map((ingredient) => ingredient.name);

    res.json(ingredientNames);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
