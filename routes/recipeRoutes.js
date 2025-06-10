const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} = require("../controllers/recipeController");

const router = express.Router();
router.post("/createrecipes", createRecipe);
router.get("/recipes", getAllRecipes);
router.get("/recipes/:id", getRecipeById);

module.exports = router;
