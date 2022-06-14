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

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkUserDetails=checkUserDetails;
exports.getUserRecipes=getUserRecipes;