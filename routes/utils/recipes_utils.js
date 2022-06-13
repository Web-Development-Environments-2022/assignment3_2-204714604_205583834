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
    return await axios.get(`${api_domain}/random`, {
        params: {
            number: recipesNumber,
            apiKey: process.env.spooncular_apiKey
        }

    });
}

exports.getRandomRecipes = getRandomRecipes;
