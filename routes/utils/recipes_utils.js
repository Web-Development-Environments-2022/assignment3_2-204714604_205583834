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
    recipes_id=getFavoriteRecipes(username);
    for (let i=0;i<recipes_id.length;i++){
        if (recipes_id[i]===recipe_id){
            return true;
        }
    }
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


// async function getRandomRecipes(recipesNumber){
//     const response= await axios.get(`${api_domain}/random`, {
//         params: {
//             number: recipesNumber,
//             apiKey: process.env.spooncular_apiKey
//         }

//     });
//     return response.data;
// }


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

function extarctRecipesPreviewDetails(recipes_info){
    return recipes_info.map((recipe_info) => {
        let data = recipe_info;
        if(recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return{
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            // popularity: popularity,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
        }
    })    
}



async function getSearchResults(query,number,cuisine,diet,intolerances) {
    const response= await axios.get(`${api_domain}/complexSearch/`, {
        params: {
            query:query,
            number:number,
            cuisine:cuisine,
            diet:diet,
            intolerances:intolerances,
            apiKey: process.env.spooncular_apiKey
        }

    });
    return response.data;
}
exports.getSearchResults = getSearchResults;


async function getRandomRecipes() {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number : 10,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

exports.getRandomRecipes = getRandomRecipes;

async function getPrevByRecipe(recipe){
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } =recipe;
    return  { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree }

}
async function getRandomThreeRecipes(){
    let random_pool = await getRandomRecipes();
    let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.title
         && random.readyInMinutes && random.servings && random.extendedIngredients && random.servings && random.aggregateLikes
         && random.vegan && random.vegetarian && random.glutenFree));
    if(filterd_random_pool.length < 3){
        return getRandomThreeRecipes();
    }
    let info1=random_pool.data.recipes[0];
    let info2=random_pool.data.recipes[1];
    let info3=random_pool.data.recipes[2];

    return extarctRecipesPreviewDetails([info1,info2,info3]);
    //need to extract preview

    
}

exports.getRandomThreeRecipes = getRandomThreeRecipes;


// async function ExtractPreviewFromId(){
//     let random_pool = await getRandomRecipes();
//     let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.title
//          && random.readyInMinutes && random.servings && random.extendedIngredients && random.servings && random.aggregateLikes
//          && random.vegan && random.vegetarian && random.glutenFree));
//     if(filterd_random_pool.length < 3){
//         return getRandomThreeRecipes();
//     }
//     return getRecipeDetails2([filterd_random_pool[0],filterd_random_pool[1],filterd_random_pool[2]]);
// }

// async function getRandomThreeRecipes(){
//     let random_pool = await getRandomRecipes();
//     let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.title
//          && random.readyInMinutes && random.servings && random.extendedIngredients && random.servings && random.aggregateLikes
//          && random.vegan && random.vegetarian && random.glutenFree));
//     if(filterd_random_pool.length < 3){
//         return getRandomThreeRecipes();
//     }
//     return getRecipeDetails2([filterd_random_pool[0],filterd_random_pool[1],filterd_random_pool[2]]);
// }

// exports.getRandomThreeRecipes = getRandomThreeRecipes;
