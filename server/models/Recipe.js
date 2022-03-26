const { Schema, model } = require('mongoose');

// import needed schemas
const ingredientSchema = require('./Ingredient');
// const commentSchema = require('./Comment');
// const keywordSchema = require('./Keyword');

const recipeSchema = new Schema(
	{
		creditsText: {
			type: String,
		},
		cuisines: [
			{
				type: String,
			},
		],
		description: {
			type: String,
		},
		dishTypes: [
			{
				type: String,
			},
		],
		healthScore: {
			type: Number,
		},
		image: {
			type: String,
		},
		ingredients: [ingredientSchema],
		myRating: {
			type: Number,
		},
		prepTime: {
			type: String,
		},
		servings: {
			type: Number,
		},
		sourceLink: {
			type: String,
		},
		sourceName: {
			type: String,
		},
		spoonacularLikes: {
			type: Number,
		},
		spoonacularRecipeId: {
			type: Number,
		},
		spoonacularRecipeLink: {
			type: String,
		},
		steps: [
			{
				type: String,
			},
		],
		title: {
			type: String,
			required: true,
			trim: true,
		},
		triedIt: {
			type: Boolean,
			default: false,
		},
		// comments: [commentSchema],
		// keywords: [keywordSchema],
	},
	{
		toJSON: {
			virtuals: true,
		},
		// prevents virtuals from creating duplicate of _id as `id`
		id: false,
	}
);

recipeSchema.virtual('ingredientCount').get(function () {
	return this.ingredients.length;
});

// recipeSchema.virtual('commentCount').get(function () {
// 	return this.comments.length;
// });

// recipeSchema.virtual('keywordCount').get(function () {
// 	return this.keywords.length;
// });

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;
