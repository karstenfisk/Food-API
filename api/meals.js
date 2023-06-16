const express = require("express");
const router = express.Router();

const { generateRecipe } = require("../utils/openAIUtils");

const { verifyToken } = require("../utils/tokenUtils");

const { User, Recipe } = require("../db_config");

//Define Routes

// POST /generate - Generate a meal based on the user's preferences.
router.post("/generate", async (req, res, next) => {
  try {
    const { diet, prepTime, cuisine, ingredients, macros, servings, type } =
      req.body;

    const conditions = {
      diet,
      prepTime,
      cuisine,
      ingredients,
      macros,
      servings,
      type,
    };
    const recipe = await generateRecipe(conditions);

    res.status(200).json(recipe);
  } catch (e) {
    next(e);
  }
});

// POST save - Save a recipe to the user's saved recipes.
router.post("/save", async (req, res, next) => {
  try {
    const { recipe } = req.body;
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7); // Remove the "Bearer " prefix
      // Verify the token and get the user ID
      const id = verifyToken(token);
      // Find the user in the database using the ID
      const user = await User.findByPk(id);

      if (user) {
        const { macros, ...recipeData } = recipe;

        const newRecipe = {
          ...recipeData,
          protein: macros.protein,
          fats: macros.fats,
          carbohydrates: macros.carbohydrates,
          calories: macros.calories.toString(),
        };

        // Check if recipe already exists.
        const existingRecipe = await Recipe.findOne({
          where: {
            ...newRecipe,
            userId: user.id,
          },
        });

        if (!existingRecipe) {
          // User found, create, save, and return the recipe.
          const recipeInstance = await Recipe.create({
            ...newRecipe,
            userId: user.id,
          });
          res.status(200).json(recipeInstance);
        } else {
          res.status(409).json({ error: "Recipe already exists" });
        }
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

// GET /saved - Get all of the user's saved recipes.
router.get("/saved", async (req, res, next) => {
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
        const recipes = await Recipe.findAll({
          where: {
            userId: user.id,
          },
        });
        res.json(recipes);
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

router.get("/saved/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7); // Remove the "Bearer " prefix
      // Verify the token and get the user ID
      const tokenId = verifyToken(token);
      // Find the user in the database using the ID
      const user = await User.findByPk(tokenId);

      if (!user) {
        res.status(404).json({ error: "User associated not found" });
      }

      const recipe = await Recipe.findOne({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
      }

      res.status(200).json(recipe);
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
