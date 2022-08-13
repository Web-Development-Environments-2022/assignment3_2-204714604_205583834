const DButils = require("./DButils");
const recipe_utils = require("./recipes_utils");

async function markAsFavorite(user_id, recipe_id){
    user_id=await DButils.execQuery(`select user_id from users where username='${user_id}'`); //comment when using cookie
    user_id=user_id[0].user_id; //comment when using cookie

    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getHistoryRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from history_search where user_id='${user_id}' order by counter desc`);
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
    user_id=await DButils.execQuery(`select user_id from users where username='${user_id}'`); //comment when using cookie
    user_id=user_id[0].user_id;
    let temp= await DButils.execQuery(`SELECT * FROM history_search WHERE user_id = '${user_id}' AND recipe_id = '${recipeID}'` )
    let counter=temp.length;
    await DButils.execQuery(`insert into history_search values (${counter},${user_id}, ${recipeID})`);
}

async function addtoFavorites(user_id,recipeID){
    await DButils.execQuery(`insert into favoriterecipes values (${user_id}, ${recipeID})`);
}

async function getRecipePrevSQL(recipe,user_id){
    let DishesNumber= await DButils.execQuery(`select DishesNumber from Recipes where recipe_id='${recipe.recipe_id}'`);
    let UserID= await DButils.execQuery(`select user_id from Recipes where recipe_id='${recipe.recipe_id}'`);
    let instructions= await DButils.execQuery(`select instructions from Recipes where recipe_id='${recipe.recipe_id}'`);
    let GlutenFree= await DButils.execQuery(`select GlutenFree from Recipes where recipe_id='${recipe.recipe_id}'`);
    let RecipePicture= await DButils.execQuery(`select RecipePicture from Recipes where recipe_id='${recipe.recipe_id}'`);
    let Likes= await DButils.execQuery(`select Likes from Recipes where recipe_id='${recipe.recipe_id}'`);
    let CookingTime= await DButils.execQuery(`select CookingTime from Recipes where recipe_id='${recipe.recipe_id}'`);
    let Veganism= await DButils.execQuery(`select Veganism from Recipes where recipe_id='${recipe.recipe_id}'`);
    let Vegeterian= await DButils.execQuery(`select Vegeterian from Recipes where recipe_id='${recipe.recipe_id}'`);
    let RecipeID= await DButils.execQuery(`select recipe_id from Recipes where recipe_id='${recipe.recipe_id}'`);
    let RecipeName= await DButils.execQuery(`select RecipeName from Recipes where recipe_id='${recipe.recipe_id}'`);
    let isclcicked=await recipe_utils.isClickedByUser(RecipeID,user_id);
    let isFavorite=await recipe_utils.isClickedByUser(RecipeID,user_id);

    return{
        UserID:UserID[0].user_id,
        DishesNumber:DishesNumber[0].DishesNumber,
        instructions:instructions[0].instructions,
        GlutenFree:GlutenFree[0].GlutenFree,
        RecipePicture:RecipePicture[0].RecipePicture,
        Likes:Likes[0].Likes,
        CookingTime:CookingTime[0].CookingTime,
        Veganism:Veganism[0].Veganism,
        Vegeterian:Vegeterian[0].Vegeterian,
        RecipeID:RecipeID[0].RecipeID,
        RecipeName:RecipeName[0].RecipeName,
        isclcicked:isclcicked,
        isFavorite,isFavorite
    };
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkUserDetails=checkUserDetails;
exports.getUserRecipes=getUserRecipes;
exports.createRecipe=createRecipe;
exports.addtoHistory=addtoHistory;
exports.addtoFavorites=addtoFavorites;
exports.getHistoryRecipes=getHistoryRecipes;
exports.getRecipePrevSQL=getRecipePrevSQL;