const exp = require('express');
const RecipeApp = exp.Router();
const cors = require('cors');
RecipeApp.use(cors());
const { ObjectId } = require('mongodb');
RecipeApp.use(exp.json());
RecipeApp.use(exp.urlencoded({extended:true}));

// add a recipe
RecipeApp.post('/', (req, res, next) => {
    const newRecipe = req.body;
    const recipes = req.app.get('recipes');

    recipes.insertOne(newRecipe)
        .then(result => {
            res.status(201).json({ message: "Recipe successfully inserted!", id: result.insertedId });
        })
        .catch(error => {
            console.error("Error inserting recipe:", error);
            res.status(500).json({ message: "Error inserting recipe.", error: error.message });
        });
});

// get all recipes
RecipeApp.get('/',(req,res,next)=>{
    const recipes = req.app.get('recipes');
    recipes?.find().toArray()
    .then(result=>{
        res.send(result);
    })
    .catch(error=>{
        console.error("Error getting recipes:", error);
        res.status(500).json({ message: "Error getting recipes.", error: error.message });
    })
})

// delete a recipe by id
RecipeApp.delete('/:recipeId', (req, res, next) => {
    const recipes = req.app.get('recipes');
    const recipeId = new ObjectId(req.params.recipeId);
    console.log(recipeId)
    recipes.deleteOne({ _id: recipeId })
    .then(result => {
        res.status(200).json({ message: "Operation successful!" });
    })
        .catch(error => {
            console.error("Error deleting recipe:", error);
            res.status(500).json({ message: "Error deleting recipe.", error: error.message });
        });
});

// to update a recipe
RecipeApp.put('/:recipeId', (req, res, next) => {
    const recipes = req.app.get('recipes');
    const recipeId = new ObjectId(req.params.recipeId);
    const modifiedRecipe = req.body;

    // Remove the _id property from the modifiedRecipe object
    delete modifiedRecipe._id;

    console.log(modifiedRecipe)
    recipes.updateOne({ _id: recipeId }, { $set: modifiedRecipe })
        .then(result => {
            if(result.matchedCount === 0) {
                res.status(404).json({ message: "No recipe found with the given ID." });
            } else if(result.modifiedCount === 0) {
                res.status(200).json({ message: "Recipe data was the same and not modified." });
            } else {
                res.status(200).json({ message: "Recipe updated successfully." });
            }
        })
        .catch(error => {
            console.error("Error updating recipe:", error);
            res.status(500).json({ message: "Error updating recipe.", error: error.message });
        });
});


// delete all recipes
RecipeApp.delete('/',(req,res,next)=>{
    const recipes = req.app.get('recipes');
    recipes.deleteMany({})
    res.send('all recipes deleted');
})

module.exports = RecipeApp;
