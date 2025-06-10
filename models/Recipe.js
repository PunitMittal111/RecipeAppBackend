const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  unit: String,
});

const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    category: String,
    prepTime: Number,
    image: String,
    calories: Number,
    nutrition: {
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
    },
    ingredients: [ingredientSchema],
    instructions: [String],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
