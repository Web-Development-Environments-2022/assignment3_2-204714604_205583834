var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");

const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");
recipe_ids_counter=1;
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
    let recipes = await recipes_utils.getRandomThreeRecipes(req.session.user_id);
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

// router.get("/recipeExtendedInfo/:recipeId", async (req, res, next) => {
router.get("/recipeExtendedInfo/:recipeId/:userId", async (req, res, next) => {
  // let user_id=req.session.user_id;
  let user_id = req.params.userId;
  let username=user_id;
  if (user_id!="null"){
  user_id=await DButils.execQuery(`select user_id from users where username='${user_id}'`); //comment when using cookie
  user_id=user_id[0].user_id; //comment when using cookie
}
  let recipeId=req.params.recipeId;
  try {
    const recipe = await recipes_utils.getExtendedRecipeDetails(recipeId,user_id);
    res.send(recipe);
} catch (error) {
    next(error);
} 
});

router.get("/search/:query/:number/:cuisine/:diet/:intolerances",async (req, res, next) => {
  let user_id=req.session.user_id;
  let query=req.params.query;
  let number=req.params.number;
  let cuisine=req.params.cuisine;
  let diet=req.params.diet;
  let intolerances=req.params.intolerances;
  if (cuisine=="null"){
    cuisine=null;
  }
  if (diet=="null"){
    diet=null;
  }
  if (intolerances=="null"){
    intolerances=null;
  }
  try {
    const recipe = await recipes_utils.getSearchResults(query,number,cuisine,diet,intolerances);
    temp=[];
    for (let i=0;i<recipe.results.length;i++){
      let c=await recipes_utils.getRecipeDetails2(recipe.results[i].id,user_id);
      temp.push(c);
    }
    res.send(temp);
} catch (error) {
    next(error);
} 
}); 

router.post('/addPrivateRecipe', async (req,res,next) => {
  try 
  {
    const dishesNumber = req.body.dishesNumber;
    const instructions = req.body.instructions;
    const gluten_free = req.body.gluten_free;
    const recipePic = req.body.recipePic;
    const recipeName = req.body.recipeName;
    const likes = req.body.likes;
    const cookingTime = req.body.cookingTime;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const user_id = req.session.user_id;
    const recipeID=req.body.recipeID;
    await user_utils.createRecipe(user_id,dishesNumber, instructions, gluten_free, recipePic, likes, cookingTime, vegan, vegetarian,recipeID,recipeName);
    res.status(200).send("The Recipe upload successful");
} catch (error) {
  next(error);
}
});

router.post('/watched', async (req,res,next) => {
  try 
  {
    const user_id = req.session.user_id;
    const recipeID=req.body.recipeID;
    await user_utils.addtoHistory(user_id,recipeID);
    res.status(200).send("The Recipe recorded in the history");
} catch (error) {
  next(error);
}
});

router.post('/favorite', async (req,res,next) => {
  try 
  {
    const user_id = req.session.user_id;
    const recipeID=req.body.recipeID;
    await user_utils.addtoFavorites(user_id,recipeID);
    res.status(200).send("The Recipe uploaded to favorite");
} catch (error) {
  next(error);
}
});

module.exports = router;