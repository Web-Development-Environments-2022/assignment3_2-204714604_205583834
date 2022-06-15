var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  let temp=req.session.user_id;
  users=await DButils.execQuery("SELECT user_id FROM users");
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/** 
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get("/getFavorites",async (req, res, next) => {
  let temp=[];
  let user_id = req.session.user_id;
  try {
    const recipes = await user_utils.getFavoriteRecipes(user_id);
    // recipe_utils.getPrevByIdList(recipes,user_id).then((prevs) => {res.send(prevs)});
    if (recipes.length>0){
      temp=[]
      for (let i=0;i<recipes.length;i++){
        
        let c=await recipe_utils.getRecipeDetails2(recipes[i].recipe_id,user_id);
        temp.push(c);
      }    
      res.status(200).send(temp);
    }
    else{
      res.status(404).send("No favorite recipes");
    }
} catch (error) {
    next(error);
} 
});  

// router.post("/addFavorites",async (req, res, next) => {
//   let user_id = req.session.user_id;
//   let recipe_id = req.body.recipe_id;
//   try {
//     await user_utils.addtoFavorites(user_id, recipe_id);
//     res.status(200).send("Recipe upload to favorite list");
// } catch (error) {
//     next(error);
// } 
// });

router.get("/getWatched",async (req, res, next) => {
  let user_id = req.session.user_id;
  try {
    const recipes = await user_utils.getHistoryRecipes(user_id);
    temp=[]
    for (let i=0;i<recipes.length;i++){
        let c=await recipe_utils.getRecipeDetails2(recipes[i].recipe_id,user_id);
        temp.push(c);
      }    
    res.status(200).send(temp);
} catch (error) {
    next(error);
} 
});

router.post("/addWatched",async (req, res, next) => {
  let user_id = req.session.user_id;
  let recipe_id = req.body.recipe_id;
  try {
    await user_utils.addtoHistory(user_id, recipe_id);
    res.status(200).send("Recipe recorded to history");
} catch (error) {
    next(error);
} 
});

router.post('/logincheck', async (req,res,next) => {
  try{
    let username=req.body.username; //change to session!!!!
    let password=req.body.password;
    let isApproved=await user_utils.checkUserDetails(username,password);
    if (isApproved){
      res.status(200).send("The login succecssful");
    }
    else{
      res.status(404).send("username or password not correct");
    }
  } catch(error){
    next(error); 
  }
});

router.get("/writtenby", async (req, res, next) => {
  let user_id=req.session.user_id;
  try {
    let recipes= await user_utils.getUserRecipes(user_id);
    temp=[]
    for (let i=0;i<recipes.length;i++){
        let c=await user_utils.getRecipePrevSQL(recipes[i],user_id);
        temp.push(c);
      }    
    res.status(200).send(temp);
} catch (error) {
    next(error);
} 
});

module.exports = router;

router.get("/getLastThreeViewed", async (req, res, next) => {
  let user_id=req.session.user_id;
  try {
    let recipes= await user_utils.getHistoryRecipes(user_id);
      res.send([recipes[0],recipes[1],recipes[2]])
    


} catch (error) {
    next(error);
} 
});


module.exports = router;