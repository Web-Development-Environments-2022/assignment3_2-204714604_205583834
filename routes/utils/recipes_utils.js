const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

// Add a new recipe.
async function addNewRecipe(user_id, recipe_id, recipe_name, cook_time, recipe_pic, vege, vegan, gluten_free, like, dishs_num){
    await DButils.execQuery(`insert into Recipes values ('${user_id}',${recipe_id})`);
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}


exports.getRecipeDetails = getRecipeDetails;


//-------------------------------Custom Code------------------------------

async function isrFavoriteRecipe(recipe_id,username){
    //return true if (recipe_id,username) exist in Favorites Table
    //else return False
    //TODO: Implement function
    return false;
}

async function isClickedByUser(recipe_id,username){
    //return true if (recipe_id,username) exist in ClickedRecipes Table
    //else return False
    //TODO: Implement function

    return false;
}



async function getRecipeDetails2(recipe_id,username) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    let recipeClickedByUser=await isClickedByUser(recipe_id,username);
    let recipeFavoriteByUser=await isrFavoriteRecipe(recipe_id,username);

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
            popularity: aggregateLikes,
            vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        isClicked:recipeClickedByUser,
        isFavorite:recipeFavoriteByUser
    }
}

exports.getRecipeDetails2 = getRecipeDetails2;


async function getRandomRecipes(recipesNumber){
    const response= await axios.get(`${api_domain}/random`, {
        params: {
            number: recipesNumber,
            apiKey: process.env.spooncular_apiKey
        }

    });
    return response.data;
}


exports.getRandomRecipes = getRandomRecipes;

async function getExtendedRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    let {extendedIngredients,instructions,servings}= recipe_info.data
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings:servings
    }
}
exports.getExtendedRecipeDetails = getExtendedRecipeDetails;

async function getSearchResults(query,number,cuisine,diet,intolerances) {
    const response= await axios.get(`${api_domain}/complexSearch/?query=${query}&number-${number}&cuisine-${cuisine}&diet=${diet}&intolerances=${intolerances}`, {
        params: {
            number: recipesNumber,
            apiKey: process.env.spooncular_apiKey
        }

    });
    return response.data;
}