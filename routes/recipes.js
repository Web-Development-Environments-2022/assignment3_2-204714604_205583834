var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



//-----------------------Custom Code-----------------------------
router.post("/recipePreview", async (req, res, next) => {
  let recipe_id=req.body.recipeId;
  let username=req.body.username
  try {
    const recipe = await recipes_utils.getRecipeDetails2(recipe_id,username);
    res.send(recipe);
} catch (error) {
    next(error);
} 
});


router.post("/random", async (req,res,next)=>{
  try {
    let recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(recipes);
} catch (error) {
    next(error);
} 
});

// router.get("/random", async (req, res, next) => {
//   try {
//     let random_3_recipe = await recipes_utils.getRandomThreeRecipes();
//     res.send(random_3_recipe);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/recipeExtendedInfo/:recipeId", async (req, res, next) => {
  //let recipe_id=req.body.recipeId;
  let recipeId=req.params.recipeId;
  try {
    const recipe = await recipes_utils.getExtendedRecipeDetails(recipeId);
    res.send(recipe);
} catch (error) {
    next(error);
} 
});

module.exports = router;

router.get("/recipeExtendedInfo/:recipeId", async (req, res, next) => {
  //let recipe_id=req.body.recipeId;
  let recipeId=req.params.recipeId;
  try {
    const recipe = await recipes_utils.getExtendedRecipeDetails(recipeId);
    res.send(recipe);
} catch (error) {
    next(error);
} 
});

router.get("/search/:query/:number/:cuisine/:diet/:intolerances",async (req, res, next) => {
  let query=req.params.query;
  let number=req.params.number;
  let cuisine=req.params.cuisine;
  let diet=req.params.diet;
  let intolerances=req.params.intolerances;



  try {
    const recipe = await recipes_utils.getSearchResults(query,number,cuisine,diet,intolerances);
    res.send(recipe.get);
} catch (error) {
    next(error);
} 
});  

router.post('/private', async (req,res,next) => {
  try 
  {
    // Extracts all the parameters from the body
    const dishesNumber = req.body.dishesNumber;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const type_of_food = req.body.type_of_food;
    const gluten_free = req.body.gluten_free;
    const recipePic = req.body.recipePic;
    const name = req.body.name;
    const likes = req.body.likes;
    const cookingTime = req.body.cookingTime;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const user_id = req.session.user_id;

    // Creates the recipe and saves it
    const recipes = await user_utils.createRecipe(dishesNumber, ingredients, instructions, type_of_food, gluten_free, recipePic, name, likes, cookingTime, vegan, vegetarian, user_id);
    res.send(recipes.data);
} catch (error) {
  next(error);
}
});