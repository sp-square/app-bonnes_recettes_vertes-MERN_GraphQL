import React, { useState, useEffect } from 'react';
import {
	Jumbotron,
	Container,
	Col,
	Form,
	Button,
	Card,
	CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_RECIPE } from '../utils/mutations';
import {
	saveSpoonacularRecipeIds,
	getSpoonacularRecipeIds,
} from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchRecipes = () => {
	// create state for holding returned spoonacular api data
	const [searchedRecipes, setSearchedRecipes] = useState([]);
	// create state for holding our search field data
	const [searchInput, setSearchInput] = useState('');

	// create state to hold saved spoonacularRecipeId values
	const [savedSpoonacularRecipeIds, setSavedSpoonacularRecipeIds] = useState(
		getSpoonacularRecipeIds()
	);

	const [saveRecipe, { error }] = useMutation(SAVE_RECIPE);

	// set up useEffect hook to save `savedSpoonacularRecipeIds` list to localStorage on component unmount
	// learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
	useEffect(() => {
		return () => saveSpoonacularRecipeIds(savedSpoonacularRecipeIds);
	});

	// create method to search for recipes and set state on form submit
	const handleFormSubmit = async (event) => {
		event.preventDefault();

		if (!searchInput) {
			return false;
		}

		try {
			const key = Auth.getProfile().data.spoonKey;

			const response = await fetch(
				`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${searchInput}&diet=vegan&addRecipeInformation=true&addRecipeNutrition=true&sort=popularity&sortDirection=desc&number=100`
			);

			if (!response.ok) {
				throw new Error('something went wrong!');
			}

			const { results } = await response.json();

			const recipeData = results.map((recipe) => ({
				creditsText: recipe.creditsText,
				cuisines: recipe.cuisines || ['No cuisine provided'],
				description: recipe.summary,
				dishTypes: recipe.dishTypes || ['No dish type provided'],
				healthScore: recipe.healthScore,
				image: recipe.image,
				ingredients:
					recipe.nutrition?.ingredients?.map((ingredient) => ({
						spoonacularIngredientId: ingredient.id,
						quantity: ingredient.amount,
						unit: ingredient.unit,
						ingredientName: ingredient.name,
					})) || [],
				prepTime: recipe.readyInMinutes,
				servings: recipe.servings,
				sourceLink: recipe.sourceUrl,
				sourceName: recipe.sourceName,
				spoonacularLikes: recipe.aggregateLikes,
				spoonacularRecipeId: recipe.id,
				spoonacularRecipeLink: recipe.spoonacularSourceUrl,
				steps: recipe.analyzedInstructions[0]?.steps || ['No steps provided'],
				title: recipe.title,
			}));

			setSearchedRecipes(recipeData);
			setSearchInput('');
		} catch (err) {
			console.error(err);
		}
	};

	// create function to handle saving a book to our database
	const handleSaveRecipe = async (recipeId) => {
		// find the recipe in `searchedRecipes` state by the matching id
		const recipeToSave = searchedRecipes.find(
			(recipe) => recipe.spoonacularRecipeId === recipeId
		);

		// get token
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			const { data } = await saveRecipe({
				variables: { recipeData: { ...recipeToSave } },
			});
			console.log('data', data);
			console.log(savedSpoonacularRecipeIds);
			setSavedSpoonacularRecipeIds([
				...savedSpoonacularRecipeIds,
				recipeToSave.spoonacularRecipeId,
			]);
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Search Spoonacular!</h1>
					{Auth.loggedIn() ? (
						<Form onSubmit={handleFormSubmit}>
							<Form.Row>
								<Col xs={12} md={8}>
									<Form.Control
										name="searchInput"
										value={searchInput}
										onChange={(e) => setSearchInput(e.target.value)}
										type="text"
										size="lg"
										placeholder="Search for a recipe"
									/>
								</Col>
								<Col xs={12} md={4}>
									<Button type="submit" variant="success" size="lg">
										Submit Search
									</Button>
								</Col>
							</Form.Row>
						</Form>
					) : (
						<h2>Please Log In or Sign Up First</h2>
					)}
				</Container>
			</Jumbotron>

			<Container>
				<h2>
					{searchedRecipes.length
						? `Viewing ${searchedRecipes.length} results:`
						: 'Search for a recipe to begin'}
				</h2>
				<CardColumns>
					{searchedRecipes.map((recipe) => {
						return (
							<Card key={recipe.spoonacularRecipeId} border="dark">
								{recipe.image ? (
									<Card.Img
										src={recipe.image}
										alt={`The cover for ${recipe.title}`}
										variant="top"
									/>
								) : null}
								<Card.Body>
									<Card.Title>{recipe.title}</Card.Title>
									<p className="small">Source: {recipe.sourceName}</p>
									<Card.Text>{recipe.description}</Card.Text>
									<Button
										disabled={savedSpoonacularRecipeIds?.some(
											(savedId) => savedId === recipe.spoonacularRecipeId
										)}
										className="btn-block btn-info"
										onClick={() => handleSaveRecipe(recipe.spoonacularRecipeId)}
									>
										{savedSpoonacularRecipeIds?.some(
											(savedId) => savedId === recipe.spoonacularRecipeId
										)
											? 'Recipe Already Saved!'
											: 'Save This Recipe!'}
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};

export default SearchRecipes;
