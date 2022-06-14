const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function checkUserDetails(user_id, password){
    const pass = await DButils.execQuery(`select password from Users where user_id='${user_id}'`);
    return password == pass;
}

async function getUserRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from Recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function createRecipe(user_id, dishesNumber, instructions, gluten_free, recipePic, likes, cookingTime, vegan, vegetarian, recipeID, RecipeName){
    await DButils.execQuery(`insert into Recipes values (${user_id}, ${dishesNumber}, '${instructions}', ${gluten_free},
    '${recipePic}', ${likes}, ${cookingTime}, ${vegan}, ${vegetarian}, ${recipeID}, '${RecipeName}')`);
}

async function addtoHistory(user_id,recipeID){
    await DButils.execQuery(`insert into history_search values (${user_id}, ${recipeID})`);
}

async function addtoFavorites(user_id,recipeID){
    await DButils.execQuery(`insert into favoriterecipes values (${user_id}, ${recipeID})`);
}

async function getRecipePrevSQL(recipe,user_id){
    //let DishesNumber,instructions,GlutenFree,recipePic,Likes,CookingTime,vegan,vegetarian,recipeID,recipeName=await DButils.execQuery(`select DishesNumber,instructions,GlutenFree,recipePic,Likes,CookingTime,vegan,vegetarian,recipeID,recipeName= from Recipes where recipeID='${recipe}'`);
    let DishesNumber= await DButils.execQuery(`select DishesNumber from Recipes where recipeID='${recipe}'`);
    let UserID= await DButils.execQuery(`select UserID from Recipes where recipeID='${recipe}'`);
    let instructions= await DButils.execQuery(`select instructions from Recipes where recipeID='${recipe}'`);
    let GlutenFree= await DButils.execQuery(`select GlutenFree from Recipes where recipeID='${recipe}'`);
    let RecipePicture= await DButils.execQuery(`select RecipePicture from Recipes where recipeID='${recipe}'`);
    let Likes= await DButils.execQuery(`select Likes from Recipes where recipeID='${recipe}'`);
    let CookingTime= await DButils.execQuery(`select CookingTime from Recipes where recipeID='${recipe}'`);
    let Veganism= await DButils.execQuery(`select Veganism from Recipes where recipeID='${recipe}'`);
    let Vegeterian= await DButils.execQuery(`select Vegeterian from Recipes where recipeID='${recipe}'`);
    let RecipeID= await DButils.execQuery(`select RecipeID from Recipes where recipeID='${recipe}'`);
    let RecipeName= await DButils.execQuery(`select RecipeName from Recipes where recipeID='${recipe}'`);

    return{
        UserID:UserID[0],
        DishesNumber:DishesNumber[0],
        instructions:instructions[0],
        GlutenFree:GlutenFree[0],
        RecipePicture:RecipePicture[0],
        Likes:Likes[0],
        CookingTime:CookingTime[0],
        Veganism:Veganism[0],
        Vegeterian:Vegeterian[0],
        RecipeID:RecipeID[0],
        RecipeName:RecipeName[0]
    };
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkUserDetails=checkUserDetails;
exports.getUserRecipes=getUserRecipes;
exports.createRecipe=createRecipe;
exports.addtoHistory=addtoHistory;
exports.addtoFavorites=addtoFavorites;
