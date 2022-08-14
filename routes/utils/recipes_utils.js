const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");

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

//-----------------------------------------------------------------------Custom Code-----------------------------------------------------------------------

async function isrFavoriteRecipe(recipe_id, username){
    //return true if (recipe_id,username) exist in Favorites Table
    //else return False
    let recipes_id=await user_utils.getFavoriteRecipes(username);
    for (let i=0;i<recipes_id.length;i++){
        if (recipes_id[i].recipe_id===parseInt(recipe_id)){
            return true;
        }
    }
    return false;
}

async function isClickedByUser(recipe_id,username){
    let recipes_id=await user_utils.getHistoryRecipes(username);
    for (let i=0;i<recipes_id.length;i++){
        if (recipes_id[i].recipe_id===parseInt(recipe_id)){
            return true;
        }
    }
    return false;
}

async function getRecipeDetails2(recipe_id,username) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    let recipeClickedByUser=await isClickedByUser(recipe_id,username);
    let recipeFavoriteByUser=await isrFavoriteRecipe(recipe_id,username);
    let x=recipe_info.instructions;
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
        isFavorite:recipeFavoriteByUser,
        instructions:recipe_info.data.instructions
    }
}
exports.getRecipeDetails2 = getRecipeDetails2;

async function getExtendedRecipeDetails(recipe_id,user_id) {
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
        isClicked:await isClickedByUser(user_id,recipe_id),
        isFavorite:await isrFavoriteRecipe(user_id,recipe_id),
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings:servings
    }
}
exports.getExtendedRecipeDetails = getExtendedRecipeDetails;

function extarctRecipesPreviewDetails(recipes_info,user_id){
    return recipes_info.map((recipe_info) => {
        let data = recipe_info;
        // let recipeClickedByUser=await isClickedByUser(id,user_id);
        // let recipeFavoriteByUser=await isrFavoriteRecipe(id,user_id);
        if(recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
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
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            isClicked:recipeClickedByUser,
            isFavorite:recipeFavoriteByUser
        }
    })    
}
exports.extarctRecipesPreviewDetails = extarctRecipesPreviewDetails;

async function getSearchResults(query,number,cuisine,diet,intolerances) {
    let paramsObj={
        query:query,
        number:number,
        apiKey: process.env.spooncular_apiKey    
    }
    if (cuisine!=null){
        paramsObj.cuisine=cuisine
    }

    if (diet!=null){
        paramsObj.diet=diet
    }

    if (intolerances!=null){
        paramsObj.intolerances=intolerances
    }
    
    const response= await axios.get(`${api_domain}/complexSearch/`, {
        // params: {
        //     query:query,
        //     number:number,
        //     cuisine:cuisine,
        //     diet:diet,
        //     intolerances:intolerances,
        //     apiKey: process.env.spooncular_apiKey
        // }
        params:paramsObj
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
exports.getPrevByRecipe = getPrevByRecipe;

async function getRandomThreeRecipes(user_id){
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
    recipe=[info1,info2,info3];
    temp=[]
    for (let i=0;i<recipe.length;i++){
        let c=await getRecipeDetails2(recipe[i].id,user_id);
        temp.push(c);
      }
      return temp;
}
exports.getRandomThreeRecipes = getRandomThreeRecipes;

async function getPrevByIdList(ID_LST, user_id){
    res=[];
    for (let i = 0; i < ID_LST.length; i++){
      res.push(getRecipeDetails2(ID_LST[i], user_id));
    }
    return res;
  }
  exports.getPrevByIdList = getPrevByIdList;
  exports.isClickedByUser = isClickedByUser;
  exports.isrFavoriteRecipe = isrFavoriteRecipe;