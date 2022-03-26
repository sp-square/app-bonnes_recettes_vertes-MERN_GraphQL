const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		_id: ID!
		username: String!
		email: String
		recipeCount: Int
		recipes: [Recipe]
	}

	type Recipe {
		_id: ID!
		creditsText: String
		cuisines: [String]
		description: String
		dishTypes: [String]
		healthScore: Int
		image: String
		ingredientCount: Int
		ingredients: [Ingredient]
		myRating: Int
		prepTime: String
		servings: Int
		sourceLink: String
		sourceName: String
		spoonacularLikes: Int
		spoonacularRecipeId: Int
		spoonacularRecipeLink: String
		steps: [String]
		title: String!
		triedIt: Boolean
	}

	type Ingredient {
		_id: ID!
		ingredientName: String!
		quantity: Float!
		unit: String!
	}

	type Auth {
		token: ID!
		user: User
	}

	input RecipeInput {
		creditsText: String
		cuisines: [String]
		description: String
		dishTypes: [String]
		healthScore: Int
		image: String
		ingredientCount: Int
		ingredients: [IngredientInput]
		myRating: Int
		prepTime: String
		servings: Int
		sourceLink: String
		sourceName: String
		spoonacularLikes: Int
		spoonacularRecipeId: Int
		spoonacularRecipeLink: String
		steps: [String]
		title: String!
		triedIt: Boolean
	}

	input IngredientInput {
		ingredientName: String!
		quantity: Float!
		spoonacularIngredientId: Int
		unit: String
	}

	type Query {
		me: User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		addRecipe(recipeData: RecipeInput!): User
		removeRecipe(_id: ID!): User
		addIngredient(recipeId: ID!, ingredientData: IngredientInput!): Recipe
		removeIngredient(_id: ID!, recipeId: ID!): Recipe
	}
`;

module.exports = typeDefs;
