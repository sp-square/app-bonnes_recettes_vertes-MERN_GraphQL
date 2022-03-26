const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the Recipe's `ingredients` array in Recipe.js
const ingredientSchema = new Schema({
	ingredientName: {
		type: String,
		required: true,
		trim: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 0,
	},
	spoonacularIngredientId: {
		type: Number,
	},
	unit: {
		type: String,
	},
});

module.exports = ingredientSchema;
