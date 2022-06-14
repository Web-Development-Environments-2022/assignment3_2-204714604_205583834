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
    res.send(re);
} catch (error) {
    next(error);
} 
});  
