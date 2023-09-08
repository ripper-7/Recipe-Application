const exp = require('express');
const app = exp()
const { MongoClient } = require('mongodb');
app.listen(4000,()=>{console.log('server is running on the port 4000')})
const cors = require('cors');
app.use(cors());

//requires
const RecipeApp = require('./APIs/RecipeApi');

//middlewares
app.use(exp.json());
app.use(exp.urlencoded({extended:true}));

// connect to DB
MongoClient.connect('mongodb://127.0.0.1:27017')
.then((dbref)=>{
    console.log('connected to db');
    const db = dbref.db('recipeDB');
    const recipes = db.collection('recipes');
    app.set('recipes',recipes);
})

// routes
app.use('/APIs/RecipeApi',RecipeApp);

// error handling middleware
app.use((err,req,res,next)=>{
    console.log(err)
    res.send({errMsg:err.message})
})